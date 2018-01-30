const Sequelize = require('sequelize');
const scheme = require('../models/scheme');
const graphql = require('../graphql');
const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const{ MockUser, MockRoom, MockEvent, mockData, createMockData } = require('./create-mock-data');

const sequelize = new Sequelize(null, null, null,
{
  dialect : 'sqlite',
  storage : 'test-db.sqlite3',
  operatorsAliases: { $and: Sequelize.Op.and },
  logging : false
});
scheme(sequelize);
const models = sequelize.models;

const graphqlHandler = graphql(models);

describe('Testing GraphQL resolvers', function()
{
  this.timeout(10000);

  const HOUR = 60 * 60 * 1000;
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + HOUR);
  const twoHoursLater = new Date(now.getTime() + 2 * HOUR);

  before(function(done)
  {
    sequelize
      .sync({ force: true })
      .then(() => createMockData(models))
      .then(() => done(), done)
      .catch(done);
  });

  describe('Testing single queries', function()
  {
    it('query.users', function(done)
    {
      const request = createMockRequest('{ users { id, login, homeFloor, avatarUrl } }');
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          expect(data.users).to.exist;
          expect(data.users).to.have.lengthOf(mockData.users.length);
          for (let i = 0; i < mockData.users.length; ++i)
            validateUser(data.users[i], mockData.users[i]);

          done();
        })
        .catch(done);
    });

    it('query.rooms', function(done)
    {
      const request = createMockRequest('{ rooms { id, title, capacity, floor } }');
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          expect(data.rooms).to.exist;
          expect(data.rooms).to.have.lengthOf(mockData.rooms.length);
          for (let i = 0; i < mockData.rooms.length; ++i)
            validateRoom(data.rooms[i], mockData.rooms[i]);

          done();
        })
        .catch(done);
    });

    it('query.events', function(done)
    {
      const request = createMockRequest('{ events { id, title, dateStart, dateEnd, users { id }, room { id } } }');
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          expect(data.events).to.exist;
          expect(data.events).to.have.lengthOf(mockData.events.length);
          for (let i = 0; i < mockData.events.length; ++i)
            validateEvent(data.events[i], mockData.events[i]);

          done();
        })
        .catch(done);
    });

    it('query.user', function(done)
    {
      const mockUser = mockData.users[1];
      const request = createMockRequest(`{ user( id: ${mockUser.id} ) { id, login, homeFloor, avatarUrl } }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          validateUser(data.user, mockUser);

          done();
        })
        .catch(done);
    });

    it('query.room', function(done)
    {
      const mockRoom = mockData.rooms[1];
      const request = createMockRequest(`{ room ( id: ${mockRoom.id} ) { id, title, capacity, floor } }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          validateRoom(data.room, mockRoom);

          done();
        })
        .catch(done);
    });

    it('query.event', function(done)
    {
      const mockEvent = mockData.events[0];
      const request = createMockRequest(`{ event ( id: ${mockEvent.id} ) { id, title, dateStart, dateEnd, room { id }, users { id } } }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          validateEvent(data.event, mockEvent);

          done();
        })
        .catch(done);
    });
  });

  describe('Testing single mutations', function()
  {
    it('mutation.createUser', function(done)
    {
      const mockUserToCreate = new MockUser(mockData.users.length + 1, 'Azino 777', 'www.yandex.ru', 25);
      const request = createMockRequest(`mutation
      {
        createUser(input: ${mockUserToCreate.toJsonString()})
        {
          id,
          login,
          homeFloor,
          avatarUrl
        }
      }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          validateUser(data.createUser, mockUserToCreate);

          done();
        })
        .catch(done);
    });

    it('mutation.updateUser', function(done)
    {
      const mockUserToUpdate = new MockUser(mockData.users[0].id, 'Birdperson', 'www.birdperson.ru', 99);
      const request = createMockRequest(`mutation
      {
        updateUser(id: ${mockUserToUpdate.id}, input: ${mockUserToUpdate.toJsonString()})
        {
          id,
          login,
          homeFloor, 
          avatarUrl
        }
      }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          validateUser(data.updateUser, mockUserToUpdate);

          done();
        })
        .catch(done);
    });

    it('mutation.createRoom', function(done)
    {
      const mockRoomToCreate = new MockRoom(mockData.rooms.length + 1, 'London', 10, 11);
      const request = createMockRequest(`mutation
      {
        createRoom(input: ${mockRoomToCreate.toJsonString()})
        {
          id,
          title,
          capacity,
          floor
        }
      }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          validateRoom(data.createRoom, mockRoomToCreate);

          done();
        })
        .catch(done);
    });

    it('mutation.updateRoom', function(done)
    {
      const mockRoomToUpdate = new MockRoom(mockData.rooms[0].id, 'Mirkwood', 5, 1);
      const request = createMockRequest(`mutation
      {
        updateRoom(id: ${mockRoomToUpdate.id}, input: ${mockRoomToUpdate.toJsonString()})
        {
          id,
          title,
          capacity,
          floor
        }
      }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          validateRoom(data.updateRoom, mockRoomToUpdate);

          done();
        })
        .catch(done);
    });

    it('mutation.createEvent', function(done)
    {
      const mockEventToCreate = new MockEvent(mockData.events.length + 1, 'Интервью бла-бла', now, oneHourLater, [1, 2], 1);

      const request = createMockRequest(`mutation
      {
        createEvent(input: ${mockEventToCreate.toJsonString()}, usersIds: ${JSON.stringify(mockEventToCreate.userIds)}, roomId: ${mockEventToCreate.roomId})
        {
          id,
          title,
          dateStart,
          dateEnd,
          users { id },
          room { id }
        }
      }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          validateEvent(data.createEvent, mockEventToCreate);

          done();
        })
        .catch(done);
    });

    it('mutation.updateEvent', function(done)
    {
      const mockEventToUpdate = mockData.events[0];
      mockEventToUpdate.title = 'Поход в Ангбад';
      mockEventToUpdate.dateStart = oneHourLater;
      mockEventToUpdate.dateEnd = twoHoursLater;

      const request = createMockRequest(`mutation
      {
        updateEvent(id: ${mockEventToUpdate.id}, input: ${mockEventToUpdate.toJsonString()})
        {
          id,
          title,
          dateStart,
          dateEnd,
          users { id },
          room { id }
        }
      }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          validateEvent(data.updateEvent, mockEventToUpdate);

          done();
        })
        .catch(done);
    });

    it('mutation.addUserToEvent', function(done)
    {
      const mockEventToAddUser = mockData.events[1];
      const userToAdd = mockData.users.find(user => !mockEventToAddUser.userIds.includes(user.id));
      expect(userToAdd).to.exist;
      mockEventToAddUser.userIds.push(userToAdd.id);

      const request = createMockRequest(`mutation
      {
        addUserToEvent(id: ${mockEventToAddUser.id}, userId: ${userToAdd.id})
        {
          id,
          title,
          dateStart,
          dateEnd,
          users { id },
          room { id }
        }
      }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          validateEvent(data.addUserToEvent, mockEventToAddUser);

          done();
        })
        .catch(done);
    });

    it('mutation.removeUserFromEvent', function(done)
    {
      const mockEventToRemoveUser = mockData.events[2];
      expect(mockEventToRemoveUser.userIds).to.have.lengthOf.above(0);
      const userIDToRemove = mockEventToRemoveUser.userIds[0];
      mockEventToRemoveUser.userIds.splice(0, 1);

      const request = createMockRequest(`mutation
      {
        removeUserFromEvent(id: ${mockEventToRemoveUser.id}, userId: ${userIDToRemove})
        {
          id,
          title,
          dateStart,
          dateEnd,
          users { id },
          room { id }
        }
      }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          validateEvent(data.removeUserFromEvent, mockEventToRemoveUser);

          done();
        })
        .catch(done);
    });

    it('mutation.changeEventRoom', function(done)
    {
      const mockEventToChangeRoom = mockData.events[3];
      const newRoom = mockData.rooms.find(room => room.id != mockEventToChangeRoom.roomId);
      expect(newRoom).to.exist;
      mockEventToChangeRoom.roomId = newRoom.id;

      const request = createMockRequest(`mutation
      {
        changeEventRoom(id: ${mockEventToChangeRoom.id}, roomId: ${newRoom.id})
        {
          id,
          title,
          dateStart,
          dateEnd,
          users { id },
          room { id }
        }
      }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          validateEvent(data.changeEventRoom, mockEventToChangeRoom);

          done();
        })
        .catch(done);
    });

    it('mutation.removeEvent', function(done)
    {
      const mockEventToRemove = mockData.events[4];

      const request = createMockRequest(`mutation
      {
        removeEvent(id: ${mockEventToRemove.id})
        {
          id,
          title,
          dateStart,
          dateEnd,
          users { id },
          room { id }
        }
      }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          mockEventToRemove.userIds = [];
          validateEvent(data.removeEvent, mockEventToRemove);

          done();
        })
        .catch(done);
    });

    it('mutation.removeUser', function(done)
    {
      const mockUserToRemove = mockData.users[1];
      const request = createMockRequest(`mutation
      {
        removeUser(id: ${mockUserToRemove.id})
        {
          id,
          login,
          homeFloor,
          avatarUrl
        }
      }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          validateUser(data.removeUser, mockUserToRemove);

          done();
        })
        .catch(done);
    });

    it('mutation.removeRoom', function(done)
    {
      const mockRoomToRemove = mockData.rooms[1];
      const request = createMockRequest(`mutation
      {
        removeRoom(id: ${mockRoomToRemove.id})
        {
          id,
          title,
          capacity,
          floor
        }
      }`);
      const response = httpMocks.createResponse();
      
      graphqlHandler(request, response)
        .then(() =>
        {
          const data = getValidatedData(response);

          validateRoom(data.removeRoom, mockRoomToRemove);

          done();
        })
        .catch(done);
    });
  });

  describe('Testing multiple queries and mutations', function()
  {
    it('New user should be successfully created', function(done)
    {
      const getUsersBeforeRequest = createMockRequest('{ users { id, login, homeFloor, avatarUrl } }');
      const getUsersBeforeResponse = httpMocks.createResponse();

      graphqlHandler(getUsersBeforeRequest, getUsersBeforeResponse)
        .then(() =>
        {
          const dataBefore = getValidatedData(getUsersBeforeResponse);
          const usersBefore = dataBefore.users;
          expect(usersBefore).to.exist;

          const newMockUser = new MockUser(0, 'Bender', 'https://en.wikipedia.org/wiki/Bender_(Futurama)#/media/File:Bender_Rodriguez.png', 13);

          const createUserRequest = createMockRequest(`mutation
          {
            createUser(input: ${newMockUser.toJsonString()})
            {
              id,
              login,
              homeFloor,
              avatarUrl
            }
          }`);
          const createUserResponse = httpMocks.createResponse();

          return graphqlHandler(createUserRequest, createUserResponse)
            .then(() =>
            {
              const dataCreateUser = getValidatedData(createUserResponse);
              const addedUser = dataCreateUser.createUser;
              newMockUser.id = parseInt(addedUser.id);
              validateUser(addedUser, newMockUser);

              const getUsersAfterRequest = createMockRequest('{ users { id, login, homeFloor, avatarUrl } }');
              const getUsersAfterResponse = httpMocks.createResponse();

              return graphqlHandler(getUsersAfterRequest, getUsersAfterResponse)
                .then(() =>
                {
                  const dataAfter = getValidatedData(getUsersAfterResponse);
                  const usersAfter = dataAfter.users;
                  expect(usersAfter).to.exist;
                  expect(usersAfter).to.have.lengthOf(usersBefore.length + 1);
                  const addedUser = usersAfter.find(user => user.id === newMockUser.id.toString());
                  validateUser(addedUser, newMockUser);
                });
            })
        })
        .then(done)
        .catch(done);
    });
  });

  after(function(done)
  {
    sequelize
      .drop()
      .then(() => done(), done)
      .catch(done);
  });
});

function createMockRequest(query)
{
  return httpMocks.createRequest(
  {
    method: 'POST',
    headers:
    {
      'content-type': 'application/json',
      'accept': 'application/json'
    },
    body:
    {
      query: query,
      variables: null,
      operationName: null
    }
  });
}

function getValidatedData(response)
{
  const { errors, data } = JSON.parse(response._getData());
  if (errors && errors.length > 0)
  {
    throw new Error(errors[0].message);
  }
  expect(data).to.exist;
  return data;
}

function validateUser(dbUser, user)
{
  expect(dbUser).to.exist;
  expect(dbUser.id).to.be.equal(user.id.toString());
  expect(dbUser.login).to.be.equal(user.login);
  expect(dbUser.avatarUrl).to.be.equal(user.avatarUrl);
  expect(dbUser.homeFloor).to.be.equal(user.homeFloor);
}

function validateRoom(dbRoom, room)
{
  expect(dbRoom).to.exist;
  expect(dbRoom.id).to.be.equal(room.id.toString());
  expect(dbRoom.title).to.be.equal(room.title);
  expect(dbRoom.capacity).to.be.equal(room.capacity);
  expect(dbRoom.floor).to.be.equal(room.floor);
}

function validateEvent(dbEvent, event)
{
  expect(dbEvent).to.exist;
  expect(dbEvent.id).to.be.equal(event.id.toString());
  expect(dbEvent.title).to.be.equal(event.title);
  expect(Date.parse(dbEvent.dateStart)).to.be.equal(event.dateStart.getTime());
  expect(Date.parse(dbEvent.dateEnd)).to.be.equal(event.dateEnd.getTime());
  expect(dbEvent.users).to.exist;
  expect(dbEvent.users).to.have.lengthOf(event.userIds.length);
  dbEvent.users.forEach((user) =>
  {
    expect(event.userIds).to.include(parseInt(user.id));
  });
  expect(dbEvent.room).to.exist;
  expect(dbEvent.room.id).to.be.equal(event.roomId.toString());
}
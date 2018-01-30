const HOUR = 60 * 60 * 1000;
const now = new Date();
const oneHourLater = new Date(now.getTime() + HOUR);
const twoHoursLater = new Date(oneHourLater.getTime() + HOUR);
const threeHoursLater = new Date(twoHoursLater.getTime() + HOUR);
const fiveHoursLater = new Date(threeHoursLater.getTime() + 2 * HOUR);

function MockUser(id, login, avatarUrl, homeFloor)
{
  this.id = id;
  this.login = login;
  this.avatarUrl = avatarUrl;
  this.homeFloor = homeFloor;

  this.toJsonString = function()
  {
    return `{ login: \"${this.login}\", avatarUrl: \"${this.avatarUrl}\", homeFloor: ${this.homeFloor} }`;
  }
}

function MockRoom(id, title, capacity, floor)
{
  this.id = id;
  this.title = title;
  this.capacity = capacity;
  this.floor = floor;

  this.toJsonString = function()
  {
    return `{ title: \"${this.title}\", capacity: ${this.capacity}, floor: ${this.floor} }`;
  }
}

function MockEvent(id, title, dateStart, dateEnd, users, room)
{
  this.id = id;
  this.title = title;
  this.dateStart = dateStart;
  this.dateEnd = dateEnd;
  this.userIds = users;
  this.roomId = room;

  this.toJsonString = function()
  {
    return `{ title: \"${this.title}\", dateStart: \"${this.dateStart.toISOString()}\", dateEnd: \"${this.dateEnd.toISOString()}\" }`;
  }

  this.clone = function()
  {
    return new MockEvent(this.id, this.title, this.dateStart, this.dateEnd, this.users.slice(0), this.room)
  }
}

const mockData =
{
  users:
  [
    new MockUser(1, 'veged', 'https://avatars3.githubusercontent.com/u/15365?s=460&v=4', 0),
    new MockUser(2, 'alt-j', 'https://avatars1.githubusercontent.com/u/3763844?s=400&v=4', 3),
    new MockUser(3, 'yeti-or', 'https://avatars0.githubusercontent.com/u/1813468?s=460&v=4', 2)
  ],
  rooms:
  [
    new MockRoom(1, '404', 5, 4),
    new MockRoom(2, 'Деньги', 4, 2),
    new MockRoom(3, 'Карты', 4, 2),
    new MockRoom(4, 'Ствола', 2, 2),
    new MockRoom(5, '14', 6, 3)
  ],
  events:
  [
    new MockEvent(1, 'ШРИ 2018 - начало', now, oneHourLater, [1, 2], 1),
    new MockEvent(2, '👾 Хакатон 👾', oneHourLater, twoHoursLater, [2, 3], 2),
    new MockEvent(3, '🍨 Пробуем kefir.js', twoHoursLater, threeHoursLater, [1, 3], 3),
    new MockEvent(4, 'Лекция по термеху', oneHourLater, threeHoursLater, [1, 2, 3], 1),
    new MockEvent(5, 'Экзамен', twoHoursLater, fiveHoursLater, [1, 2, 3], 2)
  ]
};

module.exports.MockUser = MockUser;
module.exports.MockRoom = MockRoom;
module.exports.MockEvent = MockEvent;
module.exports.mockData = mockData;
module.exports.createMockData = function createData(models)
{
  let usersPromise = models.User.bulkCreate(mockData.users);
  let roomsPromise = models.Room.bulkCreate(mockData.rooms);

  let eventsPromise = models.Event.bulkCreate(mockData.events);

  return Promise
    .all([usersPromise, roomsPromise, eventsPromise])
    .then(() => Promise.all(
    [
      models.User.findAll(),
      models.Room.findAll(),
      models.Event.findAll()
    ]))
    .then(function([users, rooms, events])
    {
      const promises = [];
      events.forEach((event, index) =>
      {
        const mockEvent = mockData.events[index];
        const room = rooms.find(x => x.id === mockEvent.roomId);
        promises.push(event.setRoom(room));
        const eventUsers = [];
        mockEvent.userIds.forEach((userId) =>
        {
          const user = users.find(x => x.id === userId);
          eventUsers.push(user);
        });
        promises.push(event.setUsers(eventUsers));
      });

      return Promise.all(promises);
    });
}

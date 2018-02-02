import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { plainToClass } from "class-transformer";
import gql from 'graphql-tag';
import { User } from '../model/user';
import { Room } from '../model/room';
import { Event } from '../model/event';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/switchMap';


type GetUserResponse = {
  user : User;
}

type GetUsersResponse = {
  users: User[];
}

type GetRoomResponse = {
  room: Room;
}

type GetRoomsResponse = {
  rooms: Room[];
}

type GetEventResponse = {
  event: Event;
}

type GetEventsResponse = {
  events: Event[];
}

type CreateUserResponse = {
  createUser: User;
}

type UpdateUserResponse = {
  updateUser: User;
}

type RemoveUserResponse = {
  removeUser: User;
}

type CreateRoomResponse = {
  createRoom: Room;
}

type UpdateRoomResponse = {
  updateRoom: Room;
}

type RemoveRoomResponse = {
  removeRoom: Room;
}

type CreateEventResponse = {
  createEvent: Event;
}

type UpdateEventResponse = {
  updateEvent: Event;
}

type RemoveEventResponse = {
  removeEvent: Event;
}

type AddUserToEventResponse = {
  addUserToEvent: Event;
}

type RemoveUserFromEventResponse = {
  removeUserFromEvent: Event;
}

type ChangeEventRoomResponse = {
  changeEventRoom : Event;
}

@Injectable()
export class DataService {
  users: User[] = [];
  rooms: Room[] = [];
  events: Event[] = [];

  constructor(private apollo: Apollo) {
  }

  fetchData() {
    let parallelRequests = [];
    parallelRequests.push(this.getUsers());
    parallelRequests.push(this.getRooms());
    return Observable
      .forkJoin(...parallelRequests)
      .switchMap(() => this.getEvents());
  }

  getUser(id: number){
    let gettingUser$ = this.apollo.query<GetUserResponse>({query: gql `{ user(id:${id}) { id, login, avatarUrl, homeFloor } }`});
    gettingUser$.subscribe(({data}) => {
      if (data.user) {
        let fetchedUser = plainToClass(User, data.user);
        let userIndex = this.users.findIndex(user => user.id === fetchedUser.id);
        if (userIndex >= 0) {
          this.users[userIndex] = fetchedUser;
        }
      } else {
        console.error(`Failed to receive user ${id}`);
      }
    });
    return gettingUser$;
  }

  getUsers() {
    let gettingUsers$ = this.apollo.query<GetUsersResponse>({query: gql `{ users { id, login, avatarUrl, homeFloor } }`});
    gettingUsers$.subscribe(({data}) => {
      if (data.users) {
        this.users = [];
        data.users.forEach(rawUser => {
          this.users.push(plainToClass(User, rawUser));
        });
      } else {
        console.error(`Failed to receive users`);
      }
    })
    return gettingUsers$;
  }

  getRoom(id: number) {
    let gettingRoom$ = this.apollo.query<GetRoomResponse>({query: gql `{ room(id:${id}) { id, title, capacity, floor } }`});
    gettingRoom$.subscribe(({data}) =>{
      if (data.room) {
        let fetchedRoom = plainToClass(Room, data.room);
        let roomIndex = this.rooms.findIndex(room => room.id === fetchedRoom.id);
        if (roomIndex >= 0) {
          this.rooms[roomIndex] = fetchedRoom;
        }
      } else {
        console.error(`Failed to receive room ${id}`);
      }
    });
    return gettingRoom$;
  }

  getRooms() {
    let gettingRooms$ = this.apollo.query<GetRoomsResponse>({query: gql `{ rooms { id, title, capacity, floor } }`});
    gettingRooms$.subscribe(({data}) => {
      if (data.rooms) {
        this.rooms = [];
        data.rooms.forEach(rawRoom => {
        this.rooms.push(plainToClass(Room, rawRoom));
        });
      } else {
        console.error(`Failed to receive rooms`);
      }
    })
    return gettingRooms$;
  }

  getEvent(id: number) {
    let gettingEvent$ = this.apollo.query<GetEventResponse>({query: gql `{ event(id:${id}) { id, title, dateStart, dateEnd, users { id }, room { id } } }`});
    gettingEvent$.subscribe(({data}) => {
      if (data.event) {
        let fetchedEvent = plainToClass(Event, data.event);
        let eventIndex = this.events.findIndex(event => event.id === fetchedEvent.id);
        if (eventIndex >= 0) {
          this.fixEvent(fetchedEvent);
          this.events[eventIndex] = fetchedEvent;
        }
      } else {
        console.error(`Failed to receive event ${id}`);
      }
    });
    return gettingEvent$;
  }
  
  getEvents() {
    let gettingEvents$ = this.apollo.query<GetEventsResponse>({query: gql `{ events { id, title, dateStart, dateEnd, users { id }, room { id } } }`});
    gettingEvents$.subscribe(({data}) => {
      if (data.events) {
        this.events = [];
        data.events.forEach(rawEvent => {
          let event = plainToClass(Event, rawEvent);
          this.fixEvent(event);
          this.events.push(event);
        });
      } else {
        console.error(`Failed to receive events`);
      }
    });
    return gettingEvents$;
  }

  createUser(userInput: User) {
    let creatingUser$ = this.apollo.mutate<CreateUserResponse>(
    {
      mutation: gql `mutation
      {
        createUser
        (
          input:
          {
            login: \"${userInput.login}\",
            avatarUrl: \"${userInput.avatarUrl}\",
            homeFloor: ${userInput.homeFloor}
          }
        )
        {
          id,
          login,
          homeFloor,
          avatarUrl
        }
      }`
    });
    creatingUser$.subscribe(({data}) => {
      if (data.createUser) {
        let createdUser = plainToClass(User, <User>data.createUser);// без явного приведения TS не может правильно выбрать plainToClass
        this.users.push(createdUser);
      }
    });
    return creatingUser$;
  }

  updateUser(userInput: User) {
    return this.apollo.mutate<UpdateUserResponse>(
    {
      mutation: gql `mutation
      {
        updateUser
        (
          id: ${userInput.id},
          input:
          {
            login: \"${userInput.login}\",
            avatarUrl: \"${userInput.avatarUrl}\",
            homeFloor: ${userInput.homeFloor}
          }
        )
        {
          id,
          login,
          homeFloor,
          avatarUrl
        }
      }`
    });
  }

  removeUser(id: number) {
    let userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex >= 0) {
      this.users.splice(userIndex, 1);
    }
    return this.apollo.mutate<RemoveUserResponse>(
    {
      mutation: gql `mutation
      {
        removeUser(id: ${id})
        {
          id,
          login,
          homeFloor,
          avatarUrl
        }
      }`
    });
  }

  createRoom(roomInput: Room) {
    return this.apollo.mutate<CreateRoomResponse>(
    {
      mutation: gql `mutation
      {
        createRoom
        (
          input:
          {
            title: \"${roomInput.title}\",
            capacity: \"${roomInput.capacity}\",
            floor: ${roomInput.floor}
          }
        )
        {
          id,
          title,
          capacity,
          floor
        }
      }`
    });
  }

  updateRoom(roomInput: Room) {
    return this.apollo.mutate<UpdateRoomResponse>(
    {
      mutation: gql `mutation
      {
        updateRoom
        (
          id: ${roomInput.id},
          input:
          {
            title: \"${roomInput.title}\",
            capacity: \"${roomInput.capacity}\",
            floor: ${roomInput.floor}
          }
        )
        {
          id,
          title,
          capacity,
          floor
        }
      }`
    });
  }

  removeRoom(id: number) {
    let roomIndex = this.rooms.findIndex(room => room.id === id);
    if (roomIndex >= 0) {
      this.rooms.splice(roomIndex, 1);
    }
    return this.apollo.mutate<RemoveRoomResponse>(
    {
      mutation: gql `mutation
      {
        removeRoom(id: ${id})
        {
          id,
          title,
          capacity,
          floor
        }
      }`
    });
  }

  createEvent(eventInput: Event) {
    let usersIds = [];
    eventInput.users.forEach(user => usersIds.push(user.id));
    return this.apollo.mutate<CreateEventResponse>(
    {
      mutation: gql `mutation
      {
        createEvent
        (
          input:
          {
            title: \"${eventInput.title}\",
            dateStart: \"${eventInput.dateStart.toISOString()}\",
            dateEnd: \"${eventInput.dateEnd.toISOString()}\"
          }
          usersIds: ${JSON.stringify(usersIds)},
          roomId: ${eventInput.room.id}
        )
        {
          id,
          title,
          dateStart,
          dateEnd,
          users { id },
          room { id }
        }
      }`
    });
  }

  updateEvent(eventInput: Event) {
    return this.apollo.mutate<UpdateEventResponse>(
    {
      mutation: gql `mutation
      {
        updateEvent
        (
          id: ${eventInput.id},
          input:
          {
            title: \"${eventInput.title}\",
            dateStart: \"${eventInput.dateStart.toISOString()}\",
            dateEnd: \"${eventInput.dateEnd.toISOString()}\"
          }
        )
        {
          id,
          title,
          dateStart,
          dateEnd,
          users { id },
          room { id }
        }
      }`
    });
  }

  removeEvent(id: number) {
    let eventIndex = this.events.findIndex(event => event.id === id);
    if (eventIndex >= 0) {
      this.events.splice(eventIndex, 1);
    }
    return this.apollo.mutate<RemoveEventResponse>(
    {
      mutation: gql `mutation
      {
        removeEvent(id: ${id})
        {
          id,
          title,
          dateStart,
          dateEnd,
          users { id },
          room { id }
        }
      }`
    });
  }

  addUserToEventEvent(eventId: number, userId: number) {
    return this.apollo.mutate<AddUserToEventResponse>(
    {
      mutation: gql `mutation
      {
        addUserToEvent(id: ${eventId}, userId: ${userId})
        {
          id,
          title,
          dateStart,
          dateEnd,
          users { id },
          room { id }
        }
      }`
    });
  }

  removeUserFromEventEvent(eventId: number, userId: number) {
    return this.apollo.mutate<RemoveUserFromEventResponse>(
    {
      mutation: gql `mutation
      {
        removeUserFromEvent(id: ${eventId}, userId: ${userId})
        {
          id,
          title,
          dateStart,
          dateEnd,
          users { id },
          room { id }
        }
      }`
    });
  }

  changeEventRoom(eventId: number, roomId: number) {
    return this.apollo.mutate<ChangeEventRoomResponse>(
    {
      mutation: gql`mutation
      {
        changeEventRoom(id: ${eventId}, userId: ${roomId})
        {
          id,
          title,
          dateStart,
          dateEnd,
          users { id },
          room { id }
        }
      }`
    });
  }

  fixEvent(event: Event) {
    event.dateStart = new Date(Date.parse(event.dateStart.toString()));
    event.dateEnd = new Date(Date.parse(event.dateEnd.toString()));
    if (event.room) {
      let roomIndex = this.rooms.findIndex(room => room.id === event.room.id);
      if (roomIndex >= 0) {
        event.room = this.rooms[roomIndex];
      }
    }
    event.users.forEach((eventUser, index) => {
      if (eventUser) {
        let userIndex = this.users.findIndex(user => user.id === eventUser.id);
        if (userIndex >= 0) {
          event.users[index] = this.users[userIndex];
        }
      }
    })
  }

  createMockData() {
    this.users.push({
      id: 1,
      login: "Лекс Лютор",
      homeFloor: 7,
      avatarUrl: "assets/img/Man1.svg"
    });
    this.users.push({
      id: 2,
      login: "Томас Андерсон",
      homeFloor: 2,
      avatarUrl: "assets/img/luke_skywalker.svg"
    });
    this.users.push({
      id: 3,
      login: "Дарт Вейдер",
      homeFloor: 1,
      avatarUrl: "assets/img/darth-vader.svg"
    });
    this.users.push({
      id: 4,
      login: "Кларк Кент",
      homeFloor: 2,
      avatarUrl: "assets/img/Man2.svg"
    });
    this.rooms.push({
      id: 1,
      title: "Bespin",
      capacity: 10,
      floor: 7
    });
    this.rooms.push({
      id: 2,
      title: "Nabu",
      capacity: 11,
      floor: 7
    });
    this.rooms.push({
      id: 3,
      title: "Tatuin",
      capacity: 4,
      floor: 5
    });
    this.rooms.push({
      id: 4,
      title: "Hoth",
      capacity: 4,
      floor: 5
    });
    let start = new Date();
    start.setHours(11, 15, 0, 0);
    let oneHourLater = new Date(start.getTime());
    oneHourLater.setHours(oneHourLater.getHours() + 1);
    let twoHoursLater = new Date(start.getTime());
    twoHoursLater.setHours(twoHoursLater.getHours() + 2);
    let threeHoursLater = new Date(start.getTime());
    threeHoursLater.setHours(threeHoursLater.getHours() + 3);
    this.events.push({
      id: 1,
      title: "Sex on the beach",
      dateStart: start,
      dateEnd: oneHourLater,
      room: this.rooms[0],
      users: [this.users[0], this.users[1]]
    });
    this.events.push({
      id: 2,
      title: "Car wash",
      dateStart: oneHourLater,
      dateEnd: twoHoursLater,
      room: this.rooms[1],
      users: [this.users[1], this.users[2]]
    });
    this.events.push({
      id: 3,
      title: "Выборы президента",
      dateStart: start,
      dateEnd: threeHoursLater,
      room: this.rooms[2],
      users: [this.users[0], this.users[1], this.users[2]]
    });
  }
}

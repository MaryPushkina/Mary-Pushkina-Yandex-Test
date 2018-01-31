import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { User } from '../model/user';
import { Room } from '../model/room';
import { Event } from '../model/event';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

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
    this.createMockData();
  }

  fetchData() {
    let tasks = [];
    tasks.push(this.getUsers());
    tasks.push(this.getRooms());
    tasks.push(this.getEvents());
    return Observable.forkJoin(...tasks);
  }

  getUser(id: number){
    return this.apollo.query<GetUserResponse>({query: gql`{ user(id:${id}) { id, login, avatarUrl, homeFloor } }`});
  }

  getUsers() {
    return this.apollo
      .query<GetUsersResponse>({query: gql`{ users { id, login, avatarUrl, homeFloor } }`})
      .subscribe(({data}) => {
        this.users = data.users;
      })
  }

  getRoom(id: number) {
    return this.apollo.query<GetRoomResponse>({query: gql`{ room(id:${id}) { id, title, capacity, floor } }`});
  }

  getRooms() {
    return this.apollo
      .query<GetRoomsResponse>({query: gql`{ rooms { id, title, capacity, floor } }`})
      .subscribe(({data}) => {
        this.rooms = data.rooms;
      })
  }

  getEvent(id: number) {
    return this.apollo.query<GetEventResponse>({query: gql`{ event(id:${id}) { id, title, dateStart, dateEnd } }`});
  }

  getEvents() {
    return this.apollo
      .query<GetEventsResponse>({query: gql`{ events { id, title, dateStart, dateEnd } }`})
      .subscribe(({data}) => {
        this.events = data.events;
      })
  }

  createUser(userInput: User) {
    return this.apollo.mutate<CreateUserResponse>(
    {
      mutation: gql`mutation
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
  }

  updateUser(userInput: User) {
    return this.apollo.mutate<UpdateUserResponse>(
    {
      mutation: gql`mutation
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
    return this.apollo.mutate<RemoveUserResponse>(
    {
      mutation: gql`mutation
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
      mutation: gql`mutation
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
      mutation: gql`mutation
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
    return this.apollo.mutate<RemoveRoomResponse>(
    {
      mutation: gql`mutation
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
      mutation: gql`mutation
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
      mutation: gql`mutation
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
    return this.apollo.mutate<RemoveEventResponse>(
    {
      mutation: gql`mutation
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
      mutation: gql`mutation
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
      mutation: gql`mutation
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

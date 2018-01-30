import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { User } from '../model/user';
import { Room } from '../model/room';
import { Event } from '../model/event';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

type GetUsersResponse = {
  users: User[];
}

type GetRoomsResponse = {
  rooms: Room[];
}

type GetEventsResponse = {
  events: Event[];
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

  getUsers() {
    return this.apollo
      .query<GetUsersResponse>({query: gql`{ users { id, login, avatarUrl, homeFloor } }`})
      .subscribe(({data}) => {
        this.users = data.users;
      })
  }

  getUser(id: number){
    return this.apollo.query<GetUsersResponse>({query: gql`{ user(id:${id}) { id, login, avatarUrl, homeFloor } }`});
  }

  getRooms() {
    return this.apollo
      .query<GetRoomsResponse>({query: gql`{ rooms { id, title, capacity, floor } }`})
      .subscribe(({data}) => {
        this.rooms = data.rooms;
      })
  }

  getRoom(id: number) {
    return this.apollo.query<GetUsersResponse>({query: gql`{ room(id:${id}) { id, title, capacity, floor } }`});
  }

  getEvents() {
    return this.apollo
      .query<GetEventsResponse>({query: gql`{ events { id, title, dateStart, dateEnd } }`})
      .subscribe(({data}) => {
        this.events = data.events;
      })
  }

  getEvent(id: number) {
    return this.apollo.query<GetUsersResponse>({query: gql`{ event(id:${id}) { id, title, dateStart, dateEnd } }`});
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

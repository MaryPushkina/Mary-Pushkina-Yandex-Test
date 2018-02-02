import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DataService } from '../services/data.service';
import { User } from '../model/user';
import { Room } from '../model/room';
import { Event } from '../model/event';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['../../assets/css/events.css']
})
export class CreateEventComponent implements OnInit, AfterViewInit {
  event: Event;
  newUserName: string = "";
  recommendedUsers: User[] = [];
  recommendedRooms: Room[] = [];
  oneHour: number = 60 * 60 * 1000;
  datepickerID: string = "#dataMeet";
  startTimePickerID: string = "#dataMeetStart";
  endTimePickerID: string = "#dataMeetEnd";

  constructor(
    private dataService: DataService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    let now = new Date();
    this.event = {
      id: 0,
      title: "",
      dateStart: now,
      dateEnd: new Date(now.getTime() + this.oneHour),
      users: [],
      room: null
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initDateTimePickers();
    this.updateData();
    this.changeDetector.detectChanges();
  }

  initDateTimePickers() {
    $(this.datepickerID).datepicker({
      changeMonth: true,
      changeYear: true,
      showButtonPanel: true,
      yearRange: "-100:+0",
      dateFormat: "dd/MM",
      numberOfMonths: 3,
    });
    let now = new Date();
    let start = new Date();
    start.setHours(0, 0, 0, 0);
    const timepickerOptions = {
      timeFormat: 'HH:mm',
      minTime: now,
      startTime: start,
      interval: 15
    };
    $(this.startTimePickerID).timepicker(timepickerOptions);
    $(this.endTimePickerID).timepicker(timepickerOptions);
  }

  tryAddUser() {
    let newUser = this.recommendedUsers.find(user => user.login === this.newUserName);
    if (newUser && this.event.users.findIndex(eventUser => eventUser.id === newUser.id) < 0) {
      this.event.users.push(newUser);
      this.newUserName = "";
      this.updateData();
      this.changeDetector.detectChanges();
    }
  }

  removeUser(user: User) {
    let userIndex = this.event.users.findIndex(eventUser => eventUser.id === user.id);
    if (userIndex >= 0) {
      this.event.users.splice(userIndex, 1);
      this.changeDetector.detectChanges();
    }
  }

  setRoom(room: Room) {
    if (this.event.room == null || this.event.room.id !== room.id) {
      this.event.room = room;
      this.newUserName = "";
      this.updateData();
      this.changeDetector.detectChanges();
    }
  }

  createEvent() {
    this.dataService.createEvent(this.event).subscribe(() => {
      var dateText = document.createElement("div");
      var dateTextp1 = document.createElement("p");
      var dateTextp2 = document.createElement("p");
      dateTextp1.appendChild(document.createTextNode(`${this.datePipe.transform(this.event.dateStart, 'd MMMM', '', 'ru')}, ${this.datePipe.transform(this.event.dateStart, 'HH:mm')} - ${this.datePipe.transform(this.event.dateEnd, 'HH:mm')}`));
      dateTextp2.appendChild(document.createTextNode(`${this.event.room.title} ${this.event.room.floor} этаж`));
      dateText.appendChild(dateTextp1);
      dateText.appendChild(dateTextp2);

      swal({
        icon: "assets/img/emoji2.svg",
        title: 'Встреча создана',
        content: dateText,
        buttons: {
            true: "Хорошо",
        }
      })
      .then(() => {
        this.goToTimeboard();
      });
    });
  }

  cancel() {
    this.goToTimeboard();
  }

  goToTimeboard() {
    this.router.navigate(['/']);
  }

  updateData() {
    this.recommendedUsers = [];
    this.dataService.users.forEach(user => {
      let userIndex = this.event.users.findIndex(eventUser => eventUser.id === user.id);
      let isUserInEvent = userIndex >= 0;
      if (isUserInEvent)
        this.event[userIndex] = user;
      else
        this.recommendedUsers.push(user);
    });
    this.recommendedRooms = this.dataService.rooms.slice(0);
    let roomIndex = this.dataService.rooms.findIndex(room => this.event.room != null && room.id === this.event.room.id);
    if (roomIndex >= 0)
      this.event.room = this.dataService.rooms[roomIndex];
    else
      this.event.room = null;
    let now = new Date();
    if (this.event.dateStart < now) {
      this.event.dateStart = now;
      let datepickField = $(this.datepickerID);
      datepickField.datepicker("setDate", this.event.dateStart);
    }
    if (this.event.dateEnd < this.event.dateStart) {
      this.event.dateStart = this.event.dateStart;
    }
  }

  isRoomSelected(room: Room) : boolean {
    let isSelected = this.event.room != null && this.event.room.id === room.id;
    return isSelected;
  }
}

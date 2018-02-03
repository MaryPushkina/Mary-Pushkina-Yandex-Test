import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/switchMap';
import { DataService } from '../services/data.service';
import { User } from '../model/user';
import { Room } from '../model/room';
import { Event } from '../model/event';
import { datepickerLocalize } from '../utility/datpicker-localize';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['../../assets/css/events.css']
})
export class EditEventComponent implements OnInit, AfterViewInit {
  event: Event;
  originalEvent: Event;
  newUserName: string = "";
  recommendedUsers: User[] = [];
  recommendedRooms: Room[] = [];
  oneHour: number = 60 * 60 * 1000;
  datepickerID: string = "#dataMeet";
  startTimePickerID: string = "#dataMeetStart";
  endTimePickerID: string = "#dataMeetEnd";
  isRoomRemoved: boolean = false;
  isSaveAllowed: boolean = true;
  isRemoveAllowed: boolean = true;

  constructor(
    private dataService: DataService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
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
    this.route.paramMap.subscribe(params => {
      if (!params.has('id')) {
        console.error(`no event id specified`);
        this.goToTimeboard();
        return;
      }
      let eventID = parseInt(params.get('id'));
      if (isNaN(eventID)) {
        console.error(`event id is Nan`);
        this.goToTimeboard();
        return;
      }
      let eventToEdit = this.dataService.events.find(event => event.id == eventID); // почему-то '===' здесь не работает, хотя оба значения должны быть одного типа Number
      if (!eventToEdit) {
        console.error(`no event with id = ${eventID}`);
        this.goToTimeboard();
        return;
      }
      this.originalEvent = eventToEdit;
      this.event = Object.assign(Object.create(eventToEdit), eventToEdit);
      this.event.users = eventToEdit.users.slice();
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initDateTimePickers();
    this.updateData();
    this.changeDetector.detectChanges();
  }

  initDateTimePickers() {
    datepickerLocalize();
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

  saveChanges() {
    console.log("Saving changes");
    this.isSaveAllowed = false;
    this.isRemoveAllowed = false;
    this.event.dateStart = this.originalEvent.dateStart;
    this.event.dateEnd = this.originalEvent.dateEnd;
    let parallelRequests = [];
    parallelRequests.push(this.dataService.updateEvent(this.event));
    this.originalEvent.users.forEach(user => {
      let isUserRemoved = this.event.users.findIndex(x => x.id === user.id) < 0;
      if (isUserRemoved) {
        parallelRequests.push(this.dataService.removeUserFromEvent(this.event, user));
      }
    })
    this.event.users.forEach(user => {
      let isUserAdded = this.originalEvent.users.findIndex(x => x.id === user.id) < 0;
      if (isUserAdded) {
        parallelRequests.push(this.dataService.addUserToEvent(this.event, user));
      }
    })
    if (this.event.room.id !== this.originalEvent.room.id) {
      parallelRequests.push(this.dataService.changeEventRoom(this.event, this.event.room));
    }
    Observable
      .forkJoin(...parallelRequests)
      .subscribe(() => {
          this.isSaveAllowed = true;
          this.isRemoveAllowed = true;
          this.originalEvent = this.dataService.events.find(event => event.id === this.originalEvent.id);
          swal({
          icon: "assets/img/emoji2.svg",
          title: 'Встреча была успешно изменена',
          buttons: {
              cancel: "Редактировать еще",
              true: "Хорошо",
          }
        })
        .then((ok) => {
          if (ok) {
            this.goToTimeboard();
          }
        });
      });
  }

  removeEvent() {
    this.isRemoveAllowed = false;
    swal({
      icon: "assets/img/emoji1.svg",
      title: 'Встреча будет удалена безвозвратно',
      dangerMode: true,
      buttons: {
          cancel: "Отмена",
          true: "Удалить",
      }
    })
    .then((isRemoveConfirmed) => {
      this.isRemoveAllowed = true;
      if (isRemoveConfirmed) {
        this.dataService.removeEvent(this.event).subscribe(() => {
          this.goToTimeboard();
        });
      }
    });
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

  removeRoom() {
    this.isRoomRemoved = true;
    this.event.room = null;
  }
}

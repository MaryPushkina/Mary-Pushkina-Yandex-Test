import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Room } from '../model/room';
import { Event } from '../model/event';
import { datepickerLocalize } from '../utility/datpicker-localize';

declare var $: any;

type EventViewData = {
  event: Event;
  startPosition: number;
  endPosition: number;
}

type RoomViewData = {
  room: Room;
  isFull: boolean;
  events: EventViewData[];
}

type FloorViewData = {
  number: number;
  rooms: RoomViewData[];
}

@Component({
  selector: 'app-timeboard',
  templateUrl: './timeboard.component.html',
  styleUrls: ['./timeboard.component.css']
})
export class TimeboardComponent implements OnInit, AfterViewInit {
  floors: FloorViewData[] = [];
  selectedEvent: Event;
  selectedRoom: Room;
  datepickerID: string = "#iddate";
  dateappendixID: string = "#dateappendix";
  modalWindowID: string = "#event_info_Modal";
  timelimeColumns: number[] = [];
  oneDay: number = 24 * 60 * 60 * 1000;
  startHour: number = 8;
  endHour: number = 23;
  now: Date;
  selectedDate: Date;
  nextDate: Date;
  startDate: Date;
  endDate: Date;
  isCurrentTimeLineVisible: boolean = true;
  currentTimeLineLeftOffset: number = 0;
  buttonTime: Date;
  isTimeLineButtonVisible: boolean = true;
  timeLineButtonOffset: number = 0;

  constructor(
    private dataService: DataService,
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) {
    for (let hour = this.startHour; hour <= this.endHour; hour++)
      this.timelimeColumns.push(hour);
    let now = new Date();
    this.selectedEvent = {
      id: 0,
      title: "",
      dateStart: now,
      dateEnd: now,
      room: {
        id: 0,
        title: "",
        capacity: 0,
        floor: 0
      },
      users: []
    };
  }

  ngOnInit() {
    this.dataService
      .fetchData()
      .subscribe(() => {
        this.updateData();
        this.changeDetector.detectChanges();
      });
  }

  ngAfterViewInit() {
    this.initDatepicker();
    this.updateData();
    this.changeDetector.detectChanges();
  }

  initDatepicker() {
    datepickerLocalize();
    $(this.datepickerID).datepicker({
      language: 'ru',
      buttonText: 'Show Date',
      dateFormat: 'dd M',
      numberOfMonths: 3,
      onSelect: () => { setTimeout(() => { this.onDatePicked(); }, 10); }
    });
    this.setSelectedDate(new Date());
    this.updateDatepicker();
  }

  setSelectedDate(date: Date) {
    this.selectedDate = date;
    this.selectedDate.setHours(0, 0, 0, 0);
    this.nextDate = new Date(this.selectedDate.getTime() + this.oneDay);
    this.changeDateappendix(this.selectedDate);
  }

  showDatepicker() {
    $(this.datepickerID).datepicker('show');
  }

  updateDatepicker() {
    $(this.datepickerID).datepicker("setDate", this.selectedDate);
    this.changeDateappendix(this.selectedDate);
  }

  onDatePicked() {
    let datepickField = $(this.datepickerID);
    if (datepickField != null) {
      let pickedDate = datepickField.datepicker("getDate");
      this.setSelectedDate(pickedDate);
      this.updateData();
      this.changeDetector.detectChanges();
    }
  }

  setPageTimeAgo() {
    let datepickField = $(this.datepickerID);
    var currentDate = datepickField.datepicker("getDate");
    this.setSelectedDate(new Date(currentDate.getTime() - this.oneDay));
    this.updateDatepicker();
    this.updateData();
    this.changeDetector.detectChanges();
  }

  setPageTimeNext() {
    let datepickField = $(this.datepickerID);
    var currentDate = datepickField.datepicker("getDate");
    this.setSelectedDate(new Date(currentDate.getTime() + this.oneDay));
    this.updateDatepicker();
    this.updateData();
    this.changeDetector.detectChanges();
  }

  changeDateappendix(date) {
    let now = new Date();
    let yesterday = new Date(now.getTime() - this.oneDay);
    let tomorrow = new Date(now.getTime() + this.oneDay);
    let appendix = "";
    if (this.isDateEqual(date, now)) {
      appendix = ' -  сегодня';
    } else if (this.isDateEqual(date, yesterday)) {
      appendix = ' -  вчера';
    } else if (this.isDateEqual(date, tomorrow)) {
      appendix = ' -  завтра';
    }
    $(this.dateappendixID).html(appendix);
  }

  isDateEqual(first: Date, second: Date): boolean {
    return first.getDate() === second.getDate() &&
      first.getMonth() === second.getMonth() &&
      first.getFullYear() == second.getFullYear();
  }

  updateData() {
    this.now = new Date();
    this.startDate = new Date(this.selectedDate.getTime());
    this.startDate.setHours(this.startHour, 0, 0, 0);
    this.endDate = new Date(this.selectedDate.getTime());
    this.endDate.setHours(this.endHour, 0, 0, 0);
    this.floors = [];
    this.dataService.rooms.forEach(room => {
      let floorViewData = this.floors.find(floor => floor.number === room.floor);
      if (!floorViewData) {
        floorViewData = {
          number: room.floor,
          rooms: []
        };
        this.floors.push(floorViewData);
      }
      let roomViewData = {
        room: room,
        isFull: false,
        events: []
      };
      this.dataService.events.forEach(event => {
        if (event.room && event.room.id === room.id && event.dateStart >= this.selectedDate && event.dateEnd <= this.nextDate) {
          let eventViewData: EventViewData = {
            event: event,
            startPosition: Math.min(Math.max(0, (this.getTotalHours(event.dateStart) - this.startHour) / (this.endHour - this.startHour)), 1) * 100,
            endPosition: Math.min(Math.max(0, (this.endHour - this.getTotalHours(event.dateEnd)) / (this.endHour - this.startHour)), 1) * 100,
          };
          roomViewData.events.push(eventViewData);
        }
      });
      floorViewData.rooms.push(roomViewData);
    });
    this.updateCurrentTimeLine();
  }

  getTotalHours(date: Date): number {
    return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  }

  showEventInfo(event: Event, userInput: any) {
    if (event) {
      this.selectedEvent = event;
      userInput.stopPropagation();
      $("#dialogModal").attr("style", "display:block");
      let eventView = $(`#event_${event.id}`);
      let eventViewOffset = eventView.offset();
      let centerX = eventViewOffset.left + eventView.outerWidth(true) / 2;
      let centerY = eventViewOffset.top + eventView.outerHeight(true) / 2;
      $("#event_info").attr("style", `top: ${centerY + 5}px;left:${centerX - 25}px;`);
      $(this.modalWindowID).modal('show');
    }
  }

  createEvent() {
    this.router.navigate(['/create-event'], { queryParams: {dateStart: this.buttonTime.toISOString() } });
  }

  createEventInSelectedRoom() {
    this.router.navigate(['/create-event'], { queryParams: { room: this.selectedRoom.id.toString(), dateStart: this.buttonTime.toISOString() } });
  }

  editEvent(event: Event) {
    if (event) {
      $(this.modalWindowID).modal('hide');
      this.router.navigate(['/edit-event', event.id]);
    }
  }

  getMemebersText(count: number) : string {
    if (count <= 1)
      return "участник";
    else if (count < 5)
      return "участника";
    else
      return "участников";
  }

  selectRoom(room: Room) {
    this.selectedRoom = room;
  }

  isRoomSelected(room: Room) : boolean {
    return this.selectedRoom && this.selectedRoom.id === room.id;
  }

  updateCurrentTimeLine() {
    this.isCurrentTimeLineVisible = this.now.getTime() >= this.startDate.getTime() && this.now.getTime() <= this.endDate.getTime();
    this.currentTimeLineLeftOffset = (this.now.getTime() - this.startDate.getTime()) / (this.endDate.getTime() - this.startDate.getTime()) * 100;
    this.buttonTime = this.startDate;
    if (this.now > this.startDate) {
      this.buttonTime = this.now;
    }
    if (this.selectedRoom) {
      this.floors.forEach(floor => {
        floor.rooms.forEach(room => {
          if (room.room.id  === this.selectedRoom.id) {
            room.events.forEach(event => {
              if (event.event.dateEnd > this.buttonTime) {
                this.buttonTime = event.event.dateEnd;
              }
            })
          }
        })
      })
    }
    this.isTimeLineButtonVisible = this.isCurrentTimeLineVisible && this.buttonTime.getTime() >= this.startDate.getTime() && this.buttonTime.getTime() < this.endDate.getTime();
    this.timeLineButtonOffset = (this.buttonTime.getTime() - this.startDate.getTime()) / (this.endDate.getTime() - this.startDate.getTime()) * 100;
  }
}

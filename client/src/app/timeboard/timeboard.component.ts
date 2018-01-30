import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { DataService } from '../services/data.service';
import { Room } from '../model/room';
import { Event } from '../model/event';
declare var $: any;
declare var jQuery: any;

type EventViewData = {
  event: Event;
  startPosition: number;
  endPosition: number;
}

type RoomViewData = {
  room : Room;
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
  datepickerID : string = "#iddate";
  dateappendixID : string = "#dateappendix";
  timelimeColumns: number[] = [];
  oneDay: number = 24 * 60 * 60 * 1000;
  startHour: number = 8;
  endHour: number = 23;
  selectedDate: Date;
  startDate: Date;
  endDate: Date;

  constructor(private dataService: DataService, private changeDetector: ChangeDetectorRef) {
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
  }

  ngAfterViewInit() {
    this.initDatepicker();
    this.updateData();
    this.changeDetector.detectChanges();
  }

  initDatepicker() {
    $.datepicker.regional.ru = {
        closeText: 'Закрыть',
        prevText: '&#x3c;Пред',
        nextText: 'След&#x3e;',
        currentText: 'Сегодня',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ],
        monthNamesShort: ['Янв', 'Февр', 'Март', 'Апр', 'Май', 'Июнь',
            'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'
        ],
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        weekHeader: 'Нед',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $(this.datepickerID).datepicker({
        language: 'ru',
        buttonText: 'Show Date',
        dateFormat: 'dd M',
        numberOfMonths: 3
    });
    $.datepicker.setDefaults($.datepicker.regional['ru']);
    this.selectedDate = new Date();
    this.selectedDate.setHours(0, 0, 0, 0);
    this.updateDatepicker();
  }

  showDatepicker() {
    $(this.datepickerID).datepicker('show');
  }

  updateDatepicker() {
    $(this.datepickerID).datepicker("setDate", this.selectedDate);
    this.changeDateappendix(this.selectedDate);
  }

  setPageTimeAgo() {
    let datepickField = $(this.datepickerID);
    var currentDate = datepickField.datepicker("getDate");
    this.selectedDate = new Date(currentDate.getTime() - this.oneDay);
    this.selectedDate.setHours(0, 0, 0, 0);
    this.updateDatepicker();
    this.updateData();
  }

  setPageTimeNext() {
    let datepickField = $(this.datepickerID);
    var currentDate = datepickField.datepicker("getDate");
   this.selectedDate = new Date(currentDate.getTime() + this.oneDay);
   this.selectedDate.setHours(0, 0, 0, 0);
    this.updateDatepicker();
    this.updateData();
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

  isDateEqual(first: Date, second: Date) : boolean {
    return first.getDate() === second.getDate() &&
           first.getMonth() === second.getMonth() &&
           first.getFullYear() == second.getFullYear();
  }

  updateData() {
    this.startDate = new Date();
    this.startDate.setHours(this.startHour, 0, 0, 0);
    this.endDate = new Date();
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
        if (event.room.id === room.id && event.dateStart >= this.startDate && event.dateStart <= this.endDate) {
          let eventViewData: EventViewData = {
            event: event,
            startPosition: Math.min(Math.max(0, (this.getTotalHours(event.dateStart) - this.startHour) / (this.endHour - this.startHour)), 1) * 100,
            endPosition:  Math.min(Math.max(0, (this.endHour - this.getTotalHours(event.dateEnd))/ (this.endHour - this.startHour)), 1) * 100,
          };
          roomViewData.events.push(eventViewData);
        }
      });
      floorViewData.rooms.push(roomViewData);
    });
  }

  getTotalHours(date: Date) : number {
    return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  }

  showEventInfo(event: Event) {
    if (event) {
      this.selectedEvent = event;
    }
  }
}

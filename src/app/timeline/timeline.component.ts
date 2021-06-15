import { JsonService } from './../services/json.service';
import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, AfterViewInit, AfterViewChecked {
  channels: any;
  channelsDates: any;
  minutes: number[] = [];
  halfHrsMinutes: number[] = [];
  currentTime: number = 0;
  todayProg: any;
  todayProgTime: any;
  progs: any = [];

  constructor(private jsonService: JsonService) {}

  ngOnInit(): void {
    this.channelsDates = [];
    this.todayProg = [];
    this.todayProgTime = [];
    let progDates: any = [];

    // Convert and assign UTC time
    this.runTime()

    // Create timeline of 1 minute a day
    for (let index = 0; index < 1440; index++) {
      this.minutes.push((index + 1));
    }

    // Create timeline of 30 minutes a day
    for (let index = 0; index < 720; index++) {
      this.halfHrsMinutes.push(index * 30);
    }

    // Get Guide JSON file data
    //assets/guide/guide.json
    //https://services.ifaith.tv/guide
    this.jsonService.getJson('assets/guide/guide.json').subscribe(jsonData => {
      this.channels = jsonData.data;
      this.channels.forEach((prog: any) => {
        if (prog.date !== '') {
          progDates.push(prog.date)
        }
      });

      progDates.filter((item: any, i: number) => {
        if (progDates.indexOf(item) === i) {
          this.channelsDates.push(item)
        }
      });
      let now = this.getTodayChannel('2021-06-06');
      console.log(this.channelsDates);

      this.channels.forEach((prog: any) => {
        if (prog.date === now) {
          this.todayProg.push(prog);
          this.todayProgTime.push(this.timeStyle(prog.time))
        }
      });
    });
  }

  ngAfterViewInit() {
    let timelineMinutes = Array.from(document.getElementsByClassName('timeline-minutes'));

    // Hide all minutes except the incrementing of 30
    timelineMinutes.forEach((el) => {
      if (!this.halfHrsMinutes.includes(Number(el.getAttribute('value'))) && Number(el.getAttribute('value')) !== this.currentTime) {
        el.classList.add('hide');
      }
    });
  }

  ngAfterViewChecked(): void {
    let selectedNum = <HTMLElement>document.querySelector('[value="' + this.currentTime + '"]');
    let startGapEl = <HTMLElement>document.getElementById('startGap');
    this.progs = Array.from(document.getElementsByClassName('prog'));

    let i = 0;

    // Add style to the current local time
    selectedNum.classList.add('currentTime');

    // Render today's programs list
    this.progs.forEach((el: any) => {
      let time = this.todayProgTime[i]
      let width = ((this.todayProgTime[i+1] - time) * 4).toString();
      el.setAttribute('style', `width: ${width}px`)
      i++;
    });

    // Create empty space before the program start (useful when a programs list starts later than 0:00)
    let startGapWidth = (this.todayProgTime[0] * 4).toString();
    startGapEl.setAttribute('style', `width: ${startGapWidth}px`);

    setInterval(() => {
      this.runTime();

      // Hide previous Current Time block and display the current one
      if (Number(selectedNum.getAttribute('value')) !== this.currentTime) {
        selectedNum.classList.remove('currentTime');
        selectedNum.classList.add('hide');
        selectedNum = <HTMLElement>document.querySelector('[value="' + this.currentTime + '"]');
        selectedNum.classList.remove('hide');
        selectedNum.classList.add('currentTime');
      }
      selectedNum.scrollIntoView({behavior: 'smooth', inline: 'center' });
    },1000);
  }

  private timeStyle(timeString: string){
    let timeStr: string[] = timeString.split(':');
    let time: number = ((parseInt(timeStr[0]) * 60) + parseInt(timeStr[1]));
    return time;
  }


  // Convert and assign UTC time
  private tConvert(timeString: any) {
    let hours = Number(timeString.match(/^(\d+)/)[1]);
    const minutes = Number(timeString.match(/:(\d+)/)[1]);
    const AMPM = timeString.match(/\s(.*)$/)[1];

    if(AMPM == "PM" && hours<12){
      hours = hours+12;
    }
    if(AMPM == "AM" && hours==12){
      hours = hours-12;
    }

    let sHours = hours.toString();
    let sMinutes = minutes.toString();

    if(hours<10){
      sHours = "0" + sHours;
    }

    if(minutes<10){
      sMinutes = "0" + sMinutes;
    }

    let localDate =  sHours + ":" + sMinutes;
    return this.timeStyle(localDate)
  }

  private runTime() {
    let timeStr: string = new Date().toLocaleTimeString('en-US', { timeZone: 'UTC' });
    this.currentTime = this.tConvert(timeStr)
    // this.currentTime = (this.localDate.getHours() * 60) + this.localDate.getMinutes();
  }

  private getTodayChannel(date: any){
    let now: string = '';
    this.channelsDates.forEach((elDate: any) => {
      if (elDate === date) {
        now = elDate;
      }
    });
    return now;
  }
}



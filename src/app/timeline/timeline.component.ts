import { JsonService } from './../services/json.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Guide } from '../types/guide';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, AfterViewInit {
  channels: any;
  localDate: Date = new Date();
  minutes: number[] = [];
  halfHrsMinutes: number[] = [];
  currentTime: number = 0;
  todayProg: any;
  todayProgTime: any;
  progs: any = [];

  constructor(private jsonService: JsonService) {}

  ngOnInit(): void {
    this.currentTime = (this.localDate.getHours() * 60) + this.localDate.getMinutes();

    for (let index = 0; index < 1440; index++) {
      this.minutes.push((index + 1));
    }

    // Create timeline of 30 minutes a day
    for (let index = 0; index < 720; index++) {
      this.halfHrsMinutes.push(index * 30);
    }

    //assets/guide/guide.json
    //https://services.ifaith.tv/guide
    this.jsonService.getJson('assets/guide/guide.json').subscribe(jsonData => {
      this.channels = jsonData.data;
      this.todayProg = [];
      this.todayProgTime = [];

      this.channels.forEach((progDate: any) => {
        if (progDate.date === '2021-06-06') {
          this.todayProg.push(progDate);
          this.todayProgTime.push(this.timeStyle(progDate.time))
        }
      });
    });
  }

  ngAfterViewInit() {
    let timelineMinutes = Array.from(document.getElementsByClassName('timeline-minutes'));
    let selectedNum = <HTMLElement>document.querySelector('[value="' + this.currentTime + '"]');
    let startGapEl = <HTMLElement>document.getElementById('startGap');

    selectedNum.classList.add('currentTime');

    timelineMinutes.forEach((el) => {
      if (!this.halfHrsMinutes.includes(Number(el.getAttribute('value'))) && Number(el.getAttribute('value')) !== this.currentTime) {
        el.classList.add('hide');
      }
    });

    setTimeout(() => {
      this.progs = Array.from(document.getElementsByClassName('prog'));
      let i = 0;

      this.progs.forEach((el: any) => {
        let time = this.todayProgTime[i]
        let width = ((this.todayProgTime[i+1] - time) * 3).toString();
        el.setAttribute('style', `width: ${width}px`)
        i++;
      });

      console.log(this.todayProgTime);


      let startGapWidth = (this.todayProgTime[0] * 3).toString();

      startGapEl.setAttribute('style', `width: ${startGapWidth}px`)
      console.log(startGapEl);

      selectedNum.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }, 500);

    setInterval(() => {
      this.localDate = new Date();
      this.currentTime = (this.localDate.getHours() * 60) + this.localDate.getMinutes();

      if (Number(selectedNum.getAttribute('value')) !== this.currentTime) {
        selectedNum.classList.remove('currentTime');
        selectedNum.classList.add('hide');
        selectedNum = <HTMLElement>document.querySelector('[value="' + this.currentTime + '"]');
        selectedNum.classList.remove('hide');
        selectedNum.classList.add('currentTime');

        selectedNum.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    },1000);
  }

  timeStyle(timeString: string){
    let timeStr: string[] = timeString.split(':');
    let time: number = ((parseInt(timeStr[0]) * 60) + parseInt(timeStr[1]));
    return time;
  }
}



import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

  @Input() width = 0;
  video: any;
  duration = 0;
  interval: any;

  constructor() { }

  ngOnInit(): void {
    this.video = document.querySelector('video') as HTMLVideoElement;
    let controls = document.querySelector('.controls') as HTMLDivElement;
    controls.style.width = `${this.width}px`;
    this.buildSeeker();
    this.playVideo();

  }

  private playVideo(){
    this.video.play();
  }

  private pause(){
    this.video.pause();
  }

  private getCurrentTime(){
    return this.video.currentTime;
  }

  private getDuration(){
    return this.video.duration;
  }

  private buildSeeker(){
    let startTime = document.querySelector('.start_time') as HTMLParagraphElement;
    // let endTime = document.querySelector('.end_time') as HTMLParagraphElement;
    let track = document.querySelector('.track') as HTMLDivElement;
    let seeker = document.createElement('div');
    let seekerStyle = seeker.style;
    seekerStyle.transition = 'all .1s';
    seekerStyle.height = '3px';
    seekerStyle.backgroundColor = 'yellow';
    seekerStyle.position = 'absolute';
    seekerStyle.left = '0';
    seekerStyle.top = '0';
    seekerStyle.width = '0';
    seekerStyle.borderRadius = '3px';
    startTime.innerHTML = '0';
    track.appendChild(seeker);
    this.interval = setInterval(() => {
      //Set current time
      startTime.innerHTML = Math.ceil(this.getCurrentTime()) < 10 ? '0' + Math.ceil(this.getCurrentTime()).toString() : Math.ceil(this.getCurrentTime()).toString() ;
      this.duration = Math.ceil(this.getDuration());
      seekerStyle.width = `${(this.getCurrentTime() / this.getDuration()) * 100}%`;
      if(this.getCurrentTime() == this.getDuration()) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

}

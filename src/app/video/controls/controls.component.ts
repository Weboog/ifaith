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
  muted = false;
  volume = 1;
  interval: any;

  constructor() { }

  ngOnInit(): void {
    this.video = document.querySelector('video') as HTMLVideoElement;
    let controls = document.querySelector('.controls') as HTMLDivElement;
    controls.style.width = `${this.width}px`;
    this.buildSeeker();
    this.moveAudioBar();
    ControlsComponent.playVideo();

  }

  toggleMuted(){
    let svg = document.querySelector('svg.speaker use') as HTMLElement;
    this.muted = !this.muted;
    this.mutedVideo(this.muted);
    svg.setAttribute('xlink:href', this.muted ? 'assets/icons/sprite.svg#src-3' : 'assets/icons/sprite.svg#src-4');
  }

  private static playVideo(){
    let video = document.querySelector('video') as HTMLVideoElement;
    video.play();
  }

  private static pause(){
    let video = document.querySelector('video') as HTMLVideoElement;
    video.pause();
  }

  private static getCurrentTime(){
    let video = document.querySelector('video') as HTMLVideoElement;
    return video.currentTime;
  }

  private static getDuration(){
    let video = document.querySelector('video') as HTMLVideoElement;
    return video.duration;
  }

  private static getVolume(){
    let video = document.querySelector('video') as HTMLVideoElement;
    return video.volume;
  }

  mutedVideo(value: boolean){
    let video = document.querySelector('video') as HTMLVideoElement;
    let audioSeeker = document.querySelector('.audio_seeker') as HTMLDivElement;
    video.muted = value;
    this.muted = value;
    if (video.muted) {
      audioSeeker.style.height = '0';
    } else {
      audioSeeker.style.height = `${this.volume * 70}px`;
    }
  }

  private setVolume(amount: number){
    let video = document.querySelector('video') as HTMLVideoElement;
    video.volume = amount;
    this.volume = amount;
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
      startTime.innerHTML = Math.ceil(ControlsComponent.getCurrentTime()) < 10 ? '0' + Math.ceil(ControlsComponent.getCurrentTime()).toString() : Math.ceil(ControlsComponent.getCurrentTime()).toString() ;
      this.duration = Math.ceil(ControlsComponent.getDuration());
      seekerStyle.width = `${(ControlsComponent.getCurrentTime() / ControlsComponent.getDuration()) * 100}%`;
      if(ControlsComponent.getCurrentTime() == ControlsComponent.getDuration()) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  private moveAudioBar(){
    let mouseIn = false;
    let offsetCalculator = document.querySelector('.offsetCalculator') as HTMLDivElement;
    let audioSeeker = document.querySelector('.audio_seeker') as HTMLDivElement;

    //On mouse Down---------------------------------------------------------------
    offsetCalculator.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      mouseIn = true;
      this.mutedVideo(false);
      let computedOffset = 70 - e.offsetY;
      audioSeeker.style.height = `${computedOffset}px`;
      this.setVolume(computedOffset / 70);
    }, false);

    //On mouse move---------------------------------------------------------------
    offsetCalculator.addEventListener('mousemove', (e) => {
      e.stopPropagation();
        if (mouseIn) {
          let computedOffset = 70 - e.offsetY;
          this.volume = computedOffset;
          audioSeeker.style.height = `${computedOffset}px`;
          this.setVolume(computedOffset / 70);
        }
    }, false);

    //Disable audio control on mouse up and mouse leave-------------------------
    offsetCalculator.addEventListener('mouseup', (e) => {
      e.stopPropagation();
      mouseIn = false;
    }, false);

    offsetCalculator.addEventListener('mouseleave', (e) => {
      e.stopPropagation();
      mouseIn = false;
    }, false);
  }

}

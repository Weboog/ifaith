import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {TimeUtilsService} from "../../services/time_utils.service";

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

  video: any;
  duration: string = '';
  muted = false;
  volume = 1;
  interval: any;

  constructor(private timeUtils: TimeUtilsService) { }

  ngOnInit(): void {
    this.video = document.querySelector('video') as HTMLVideoElement;
    this.resizeControls();
    this.buildSeeker();
    this.moveAudioBar();
    console.log(this.timeUtils.secondsToMinutes(120).format());
  }

  toggleMuted(){
    let svg = document.querySelector('svg.speaker use') as HTMLElement;
    this.muted = !this.muted;
    this.mutedVideo(this.muted);
    svg.setAttribute('href', this.muted ? 'assets/icons/sprite.svg#src-4' : 'assets/icons/sprite.svg#src-5');
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

  //resize controls to video
  private resizeControls(){
    let video = document.querySelector('.video') as HTMLDivElement;
    let controls = document.querySelector('.controls') as HTMLDivElement;
    controls.style.width = `${video.offsetHeight * 1.777777777}px`;

    window.addEventListener('resize', () => {
      controls.style.width = `${video.offsetHeight * 1.777777777}px`;
    });
  }

  toggleFullScreen(){
    console.log('fullscreen');
    let video = document.querySelector('video') as HTMLVideoElement;
    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(error => {alert('Cant set in full screen')});
    } else {
      document.exitFullscreen();
    }
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
      startTime.innerHTML = this.timeUtils.secondsToMinutes(Math.floor(ControlsComponent.getCurrentTime())).format() ;
      this.duration = this.timeUtils.secondsToMinutes(Math.floor(ControlsComponent.getDuration())).format() ;
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

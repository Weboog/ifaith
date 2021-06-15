import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {TimeUtilsService} from "../../services/time_utils.service";

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit, AfterViewInit {

  video: any;
  duration: string = '';
  currentTime: string = '';
  volume = 1;
  muted = false;
  width: number | undefined;

  constructor(private timeUtils: TimeUtilsService) { }

  ngOnInit(): void {
    this.video = document.querySelector('video') as HTMLVideoElement;
    this.resizeControls();
    this.buildSeeker();
    this.moveAudioBar();
  }

  toggleMuted(): void{
    this.muted = !this.muted;
    this.setMuted(this.muted);
  }

  setMuted(value: boolean): void{
    let audioSeeker = document.querySelector('.audio_seeker') as HTMLDivElement;
    this.video.muted = value;
    this.muted = value;
    if (this.video.muted) {
      audioSeeker.style.height = '0';
    } else {
      audioSeeker.style.height = `${this.volume * 70}px`;
    }
  }

  toggleFullScreen(){
    let videoContainer = document.querySelector('.video') as HTMLDivElement;
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(error => {alert('Cant set in full screen')});
    } else {
      document.exitFullscreen();
    }
  }

  private resizeControls(): void{
    let controls = document.querySelector('.controls') as HTMLDivElement;
    controls.style.width = `${this.video.offsetWidth}px`;
    window.addEventListener('resize', () => {
      controls.style.width = `${this.video.offsetWidth}px`;
    });
  }

  private pause(){
    this.video.pause();
  }

  private getCurrentTime(): number{
    return this.video.currentTime;
  }

  private getDuration(): number{
    return this.video.duration;
  }

  private setVolume(amount: number): void{
    this.video.volume = amount;
    this.volume = amount;
  }

  private buildSeeker(){
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
    track.appendChild(seeker);
    //////////////////////////
    this.video.addEventListener('timeupdate', () => {
      this.duration = this.timeUtils.secondsToMinutes(Math.floor(this.getDuration())).format();
      this.currentTime = this.timeUtils.secondsToMinutes(Math.floor(this.getCurrentTime())).format();
      seekerStyle.width = `${(this.getCurrentTime() / this.getDuration()) * 100}%`;
    }, false);
  }

  private moveAudioBar(){
    let mouseIn = false;
    let offsetCalculator = document.querySelector('.offsetCalculator') as HTMLDivElement;
    let audioSeeker = document.querySelector('.audio_seeker') as HTMLDivElement;

    //On mouse Down---------------------------------------------------------------
    offsetCalculator.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      mouseIn = true;
      this.setMuted(false);
      let computedOffset = 70 - e.offsetY;
      audioSeeker.style.height = `${computedOffset}px`;
      this.setVolume(computedOffset / 70);
    }, false);

    //On mouse move---------------------------------------------------------------
    offsetCalculator.addEventListener('mousemove', (e) => {
      e.stopPropagation();
        if (mouseIn) {
          let computedOffset = 70 - e.offsetY;
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

  ngAfterViewInit() {
    this.video.addEventListener('loadeddata', (e: any) => {
      this.video.muted = true;
      this.setMuted(true);
      this.video.play();
    })
  }

}

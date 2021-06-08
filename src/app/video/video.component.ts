import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  video: any;
  videoWidth = 0;

  constructor() { }

  ngOnInit(): void {
    this.video = document.querySelector('.video') as HTMLVideoElement;
    this.videoWidth = this.video.offsetHeight * 1.777777777;
  }

}

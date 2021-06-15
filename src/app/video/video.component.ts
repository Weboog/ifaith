import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FavouritesService} from "../services/favourites.service";
import {JsonService} from "../services/json.service";

declare var Hls: any;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, AfterViewInit {

  video: any;
  videoWidth = 0;

  constructor(private favouritesService: FavouritesService, private jsonService: JsonService) { }

  ngOnInit(): void {
    this.favouritesService.add(37);
    //this.favouritesService.remove(71); //return true if item exists and removed and false otherwise
    // console.log(this.favouritesService.getItems()); //Get all fav list in array
    // this.favouritesService.clear();
  }

  toggleControls(video: HTMLVideoElement){
    let controls = document.querySelector('.controls') as HTMLDivElement;
    video.addEventListener('mouseover', (e) => {
      controls.addEventListener('mouseover', (e) => {
        controls.style.opacity = '1';
      });
      controls.style.opacity = '1';
    });

    video.addEventListener('mouseleave', (e) => {
      controls.addEventListener('mouseleave', (e) => {
        controls.style.opacity = '0';
      });
      controls.style.opacity = '0';
    });
  }

  ngAfterViewInit(): void {
    const video = document.querySelector('video') as HTMLVideoElement;
    const videoSrc = 'https://content-z.uplynk.com/channel/b3af354f3c39420197fd57f2d29d8510.m3u8';

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      //--------------
      hls.on(Hls.Events.LEVEL_SWITCHED, (event: any, data: any) => {
        // console.log(data, video.offsetWidth);
        window.dispatchEvent(new Event('resize'));
      });
    }

    this.toggleControls(video);
  }
}

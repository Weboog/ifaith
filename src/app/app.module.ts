import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './header/header.component';
import { VideoComponent } from './video/video.component';
import { DropmenuComponent } from './header/dropmenu/dropmenu.component';
import { ControlsComponent } from './video/controls/controls.component';
import { HttpClientModule } from "@angular/common/http";
import { FooterComponent } from './footer/footer.component';
import { TimelineComponent } from './timeline/timeline.component';
import { convertTime } from './timeline/timeConvert.pipe';
import { ChannelComponent } from './timeline/channel/channel.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    VideoComponent,
    DropmenuComponent,
    ControlsComponent,
    FooterComponent,
    TimelineComponent,
    ChannelComponent,
    convertTime
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class TimeUtilsService {

  hours: number | undefined;
  minutes: number | undefined;
  seconds: number | undefined;

  secondsToMinutes(time: number): TimeUtilsService{
    this.minutes = Math.floor(time / 60);
    this.seconds = time % 60
    return this;
  }

  format(): string{
    return `${this.minutes}:${Math.floor(<number>this.seconds)}`;
  }

}

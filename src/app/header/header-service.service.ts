import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderServiceService {

  status = false;
  menuIsDropped = new Subject<boolean>();

  constructor() { }

  toggleDrop() {
    this.status = !this.status;
    return this.menuIsDropped.next(this.status);
  }

  closeMenu(){
    this.status = false;
    this.menuIsDropped.next(false);
  }
}

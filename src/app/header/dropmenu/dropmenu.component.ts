import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HeaderServiceService } from '../header-service.service';

@Component({
  selector: 'app-dropmenu',
  templateUrl: './dropmenu.component.html',
  styleUrls: ['./dropmenu.component.scss']
})
export class DropmenuComponent implements OnInit {

  dropmenu: any;

  constructor(private headerService: HeaderServiceService) { }

  ngOnInit(): void {
    this.dropmenu = document.getElementById('drop') as HTMLUListElement;
    this.headerService.menuIsDropped.subscribe((status: boolean) => {
      this.dropmenu.style.display = status ? 'block' : 'none';
    })
  }

  closeMenu(){
    this.headerService.closeMenu();
  }

}

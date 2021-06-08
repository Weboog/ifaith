import { Component, OnInit, Output } from '@angular/core';
import { HeaderServiceService } from './header-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  status = false;

  constructor(private headerService: HeaderServiceService) { }

  ngOnInit(): void {
  }

  onMenu(){
    this.status  = !this.status;
    this.headerService.toggleDrop();
  }

}

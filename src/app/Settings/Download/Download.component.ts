import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { NavbarCommunicationService } from '../../Shared/services/NavbarCommunication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Download',
  templateUrl: './Download.component.html',
  styleUrls: ['./Download.component.css']
})
export class DownloadComponent implements OnInit {

  constructor(private _location: Location,

    private navServices:NavbarCommunicationService) { }

  ngOnInit() {
  }
 //Back loacation History
 backClicked() {
  this._location.back();
}
hideEvent(){
  this.navServices.Toggle();
}
}

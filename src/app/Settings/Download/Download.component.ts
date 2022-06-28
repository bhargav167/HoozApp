import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { NavbarCommunicationService } from '../../Shared/services/NavbarCommunication.service';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-Download',
  templateUrl: './Download.component.html',
  styleUrls: ['./Download.component.css']
})
export class DownloadComponent implements OnInit {

  constructor(private _location: Location,
    private titleService: Title, private metaService: Meta,
    private navServices:NavbarCommunicationService) { }

  ngOnInit() {
    this.titleService.setTitle("Download List");
    this.metaService.updateTag({property:'og:title',content:'Download new'})
  }
 //Back loacation History
 backClicked() {
  this._location.back();
}
hideEvent(){
  this.navServices.Toggle();
}
}

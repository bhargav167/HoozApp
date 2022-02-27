import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-Download',
  templateUrl: './Download.component.html',
  styleUrls: ['./Download.component.css']
})
export class DownloadComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit() {
  }
 //Back loacation History
 backClicked() {
  this._location.back();
}
}

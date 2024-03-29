import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { NavbarCommunicationService } from '../../Shared/services/NavbarCommunication.service';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-HelpDesk',
  templateUrl: './HelpDesk.component.html',
  styleUrls: ['./HelpDesk.component.css']
})
export class HelpDeskComponent implements OnInit {
isGS:boolean=true;
isEX:boolean=false;
isSP:boolean=false;
isCU:boolean=false;
isGetServices:boolean=false;
  constructor(private _location: Location,
    private titleService: Title, private metaService: Meta,
    private navServices:NavbarCommunicationService) { }
  ngOnInit() {
    this.titleService.setTitle("Help List");
    this.metaService.updateTag({property:'og:title',content:'Help new'})
  }

  GS() {
    this.isGS=true;
    this.isEX=false;
    this.isSP=false;
    this.isCU=false;
    this.isGetServices=false;
  }
  EX() {
    this.isGS=false;
    this.isEX=true;
    this.isSP=false;
    this.isCU=false;
    this.isGetServices=false;
  }
  SP() {
    this.isGS=false;
    this.isEX=false;
    this.isSP=true;
    this.isCU=false;
    this.isGetServices=false;
  }
  GetServices() {
    this.isGS=false;
    this.isEX=false;
    this.isSP=false;
    this.isCU=false;
    this.isGetServices=true;
  }
  CU() {
    this.isGS=false;
    this.isEX=false;
    this.isSP=false;
    this.isCU=true;
    this.isGetServices=false;
  }

  ChangeEvent(e:any) {
    if(e.target.value==1){
      this.GS();
    }
    if(e.target.value==2){
      this.EX();
    }
    if(e.target.value==3){
      this.GetServices();
    }
    if(e.target.value==4){
      this.SP();
    }
    if(e.target.value==5){
      this.CU();
    }
  }
 //Back loacation History
 backClicked() {
  this._location.back();
}

hideEvent(){
  this.navServices.Toggle();
}
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarCommunicationService {
isShowingMenu:boolean=false;
isShowingSearch:boolean=false;
constructor() { }
Toggle(){
  this.isShowingMenu=false;
  this.isShowingSearch=true;
}
}

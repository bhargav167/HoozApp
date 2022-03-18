import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarCommunicationService {
isShowingMenu:boolean=true;
constructor() { }
Toggle(){
  this.isShowingMenu=false;
}
}

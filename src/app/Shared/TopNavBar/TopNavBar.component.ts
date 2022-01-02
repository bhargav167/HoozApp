import { Component, Input, NgModule, OnInit } from '@angular/core';
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';

@Component({
  selector: 'app-TopNavBar',
  templateUrl: './TopNavBar.component.html',
  styleUrls: ['./TopNavBar.component.css']
})
export class TopNavBarComponent implements OnInit {
user:SocialAuthentication;

isLogedIn:boolean=false;
@Input() searchTerm:string;
  constructor() { }

  ngOnInit() {
    if(localStorage.getItem('user')){
      this.user= JSON.parse(localStorage.getItem('user'));
      this.isLogedIn=true; 
    }else{
      this.isLogedIn=false;
    }
  }
  Search(val){ 
    this.searchTerm=val;
  }
  LogOut(){
    localStorage.clear();
    location.href='/login';
  }
}

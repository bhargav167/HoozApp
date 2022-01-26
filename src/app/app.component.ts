import { Component, OnInit } from "@angular/core";

 

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  token:string;
  loggedIn:boolean=false; 
  constructor() {}

  ngOnInit() { 
  this.token = localStorage.getItem('user');
  this.IsLogin(); 
  }
  IsLogin(){
    if (this.token) {
      this.loggedIn=true; 
    }
  }
}

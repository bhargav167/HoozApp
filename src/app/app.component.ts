import { SharedService } from './services/SharedServices/Shared.service';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  token:string;
  loggedIn:boolean=false;
  constructor(private _routers: Router,public _sharedServices:SharedService) {}

  ngOnInit() {
  this.token = localStorage.getItem('user');
  this.IsLogin();
  }
  Search(searchTerm) {
    this._routers.navigate(['/'], { queryParams: {searchTerm:searchTerm }});
}
  IsLogin(){
    if (this.token) {
      this.loggedIn=true;
    }
  }
}

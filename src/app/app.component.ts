import { SharedService } from './services/SharedServices/Shared.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { SeoServiceService } from './services/SeoService.service';
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  token!:string;
  loggedIn:boolean=false;
  constructor(private _router: Router, private activatedRoute: ActivatedRoute, private seoService: SeoServiceService,public _sharedServices:SharedService) {

  }

  ngOnInit() {
  this.token = localStorage.getItem('user')!;
  this.IsLogin();
  }

  Search(searchTerm:string) {
    this._router.navigate(['/'], { queryParams: {searchTag:searchTerm }});
}
  IsLogin(){
    if (this.token) {
      this.loggedIn=true;
    }
  }
}

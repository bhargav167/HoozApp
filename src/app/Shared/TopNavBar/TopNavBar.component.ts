import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { fromEvent, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TagMaster } from '../../Model/TagMaster';
 import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { ProfileService } from '../../services/Auth/Profile.service';
import { NavbarCommunicationService } from '../services/NavbarCommunication.service';

@Component({
  selector: 'app-TopNavBar',
  templateUrl: './TopNavBar.component.html',
  styleUrls: ['./TopNavBar.component.css']
})
export class TopNavBarComponent implements OnInit {
@ViewChild("movieSearchInput", { static: true }) movieSearchInput: ElementRef;
user:SocialAuthentication;
navbarUserPic:string='http://res.cloudinary.com/livsolution/image/upload/c_fill,f_auto,g_faces,h_128,q_auto,w_128/DefaultUser_ktw7ga.png';
isLogedIn:boolean=false;
hidesearchlist: boolean = false;
showClose: boolean = false;
tag: TagMaster;
searchval: any;
isShowingMenu: boolean = true;
@Output() notifyParent: EventEmitter<any> = new EventEmitter();
  constructor(private _profileServices:ProfileService,private _router:Router, public navServices:NavbarCommunicationService,private _http: HttpClient) {
    if(localStorage.getItem('user')){
      this.user= JSON.parse(localStorage.getItem('user'));
      this._profileServices.GetUserProfile(this.user.Id).subscribe((data:SocialAuthentication)=>{
        this.navbarUserPic=data.UserImage;
      },err=>{
        console.log("Something wen wrong"+err);
      })
      this.isLogedIn=true;
    }else{
      this.isLogedIn=false;
    }
   }

  ngOnInit() {
    this.fireSearchlist();
  }
   //Search wall by click
   SearchByClick(searchTerm) {
    this.hidesearchlist = false;
    (document.getElementById("searchTag") as HTMLInputElement).value =
      searchTerm;
      this.notifyParent.emit(searchTerm);
  }
  //Search wall by enter
  SearchByEnter() {
    this.searchval = (
      document.getElementById("searchTag") as HTMLInputElement
    ).value;
    this.notifyParent.emit(this.searchval);
    this.hidesearchlist = false;

  }
  ClearSearch() {
    (document.getElementById("searchTag") as HTMLInputElement).value = "";
    this.showClose = false;
    this.hidesearchlist = false;

  }
  fireSearchlist() {
    fromEvent(this.movieSearchInput.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        // if character length greater then 2
        filter((res) => res.length > -1),

        // Time in milliseconds between key events
        debounceTime(0),

        // If previous query is diffent from current
        distinctUntilChanged()

        // subscription for response
      )
      .subscribe((text: string) => {
        //Search api call
        if (text == "") {
          this.hidesearchlist = false;
        }
        this.searchGetCall(text).subscribe(
          (res: any) => {
            if (res.data.length == 0) {
              this.hidesearchlist = false;
              return;
            }
            this.tag = res;
            this.hidesearchlist = true;
            this.showClose = true;
          },
          (err) => {
            console.log("error", err);
          }
        );
      });
  }

  searchGetCall(term: string) {
    if (term === "") {
      return of([]);
    }
    return this._http.get(environment.api_url + "Tag/TagSuggestion/" + term);
  }
    // Suggetion list focous out

    hide(){
      this.navServices.isShowingMenu=false;
   }
   ShowMenu(){
    this.navServices.isShowingMenu=true;
   }

  LogoClick() {
    window.location.href = "/";
  }
  RedirectToUser(userId){
    this._router.navigate(['/profile'], { queryParams: {target: userId}});
  }
  LogOut(){
    localStorage.clear();
    location.href='/';
  }
}

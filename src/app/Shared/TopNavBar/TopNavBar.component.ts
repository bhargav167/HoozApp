import { MapsAPILoader } from '@agm/core';
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
var addressLocation=null;
@Component({
  selector: 'app-TopNavBar',
  templateUrl: './TopNavBar.component.html',
  styleUrls: ['./TopNavBar.component.css']
})
export class TopNavBarComponent implements OnInit {
@ViewChild("movieSearchInput", { static: true }) movieSearchInput: ElementRef;
user:SocialAuthentication;
navbarUserPic:string='https://res.cloudinary.com/drmnyie0t/image/upload/v1652501879/Default_User_1_esjtmm.png';
isLogedIn:boolean=false;
hidesearchlist: boolean = false;
showClose: boolean = false;
tag: TagMaster;
searchval: any;
isShowingMenu: boolean = false;
location:any;
@Output() notifyParent: EventEmitter<any> = new EventEmitter();
  constructor(private _profileServices:ProfileService,private _router:Router,
    private apiloader: MapsAPILoader,
    public navServices:NavbarCommunicationService,private _http: HttpClient) {
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
    if(!localStorage.getItem("location")){
      this.AskForLocation();
    }else{
      this.location= JSON.parse(localStorage.getItem('location'));
      window.document.getElementById('addressTitle').innerText=this.location.address_components[5].long_name;
      window.document.getElementById('addrDetails').innerText= this.location.address_components[0].long_name +', '+ this.location.address_components[1].long_name +', '+ this.location.address_components[2].long_name;
    }
  }
  // ask for location
  AskForLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
          if (position) {
                 this.apiloader.load().then(() => {
                  let geocoder = new google.maps.Geocoder;
                  let latlng = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                  };

                  geocoder.geocode({
                      'location': latlng
                  }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                      if (results[1]) {
                        localStorage.setItem('location',JSON.stringify(results[1]))
                        addressLocation= results[1].address_components[0].long_name +', '+ results[1].address_components[1].long_name +', '+ results[1].address_components[2].long_name;
                        window.document.getElementById('addressTitle').innerText=results[1].address_components[5].long_name;
                        window.document.getElementById('addrDetails').innerText= addressLocation;
                      }
                  }
                    else {
                          console.log('Not found');
                      }
                  });
              });


          }else{
            window.document.getElementById('addressTitle').innerText='No address';
            window.document.getElementById('addrDetails').innerText= '';
          }
      })
  }else{

  }
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
    this.SearchByClick("");

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
    this.navServices.isShowingMenu=!this.navServices.isShowingMenu;
   }

  LogoClick() {
    window.location.href='/';
  }
  RedirectToUser(userId){
    this._router.navigate(['/profile'], { queryParams: {target: userId}});
  }
  LogOut(){
    this._profileServices.LogOut(this.user.Id).subscribe(()=>{
      localStorage.removeItem('user');
      location.href='/';
    })
  }
  url(){
    return window.location.pathname.replace('/','')
  }
  Search(){
    this.navServices.Toggle();
  }
}

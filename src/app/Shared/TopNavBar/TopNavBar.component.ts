import { MapsAPILoader } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { fromEvent, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
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
  @ViewChild("movieSearchInput", { static: true }) movieSearchInput!: ElementRef;
  public innerWidth: any;
user!:SocialAuthentication;
navbarUserPic:string='https://res.cloudinary.com/drmnyie0t/image/upload/v1652501879/Default_User_1_esjtmm.png';
isLogedIn:boolean=false;
hidesearchlist: boolean = false;
showClose: boolean = false;
tag!: any;
searchval: any;
isShowingMenu: boolean = false;
location:any;
enableMobieSearch:boolean=false;
fireSearchlistTxt: string = '';
  countryName: string = 'location';  
  addressLoc: string = '...';
@Output() notifyParent: EventEmitter<any> = new EventEmitter();
  constructor(private _profileServices:ProfileService,private _router:Router,
    private apiloader: MapsAPILoader,
    public navServices: NavbarCommunicationService, private _http: HttpClient) {
      this.location=JSON.parse(sessionStorage.getItem('location')!);
    if(localStorage.getItem('user')!){
      this.user = JSON.parse(localStorage.getItem('user')!);
      this._profileServices.GetUserProfile(this.user.Id)
      .subscribe({
        next:(data:any) => {
          this.navbarUserPic=data.UserImage;
        }
      })
      this.isLogedIn=true;
    }else{
      this.isLogedIn=false;
    }
   }
  ngOnInit() {
    if(this.location==null){
      this.AskForLocation();
    } else {
      this.countryName = this.location.address_components[5].long_name;
      this.addressLoc=this.location.address_components[0].long_name +', '+ this.location.address_components[1].long_name +', '+ this.location.address_components[2].long_name;
      // window.document.getElementById('addressTitle')!.innerText=this.location.address_components[5].long_name;
      // window.document.getElementById('addrDetails')!.innerText= this.location.address_components[0].long_name +', '+ this.location.address_components[1].long_name +', '+ this.location.address_components[2].long_name;
    }
   this.fireSearchlist(null);
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
                        sessionStorage.setItem('location', JSON.stringify(results[1]))
                        
                        addressLocation= results[1].address_components[0].long_name +', '+ results[1].address_components[1].long_name +', '+ results[1].address_components[2].long_name;
                        window.document.getElementById('addressTitle')!.innerText=results[1].address_components[5].long_name;
                        window.document.getElementById('addrDetails')!.innerText= addressLocation;
                      }
                  }
                    else {
                          console.log('Not found');
                      }
                  });
              });


          }
      }, (err) => {
        window.document.getElementById('addressTitle')!.innerText='Opps!';
        window.document.getElementById('addrDetails')!.innerText= 'location disable on this device';
      })
  }else{

  }
  }
   //Search wall by click
   SearchByClick(searchTerm:string) {
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
  fireSearchlist(eve:any) {
        if (eve.target.value == "") {
          this.hidesearchlist = false;
        }
        this.searchGetCall(eve.target.value).subscribe(
          {
            next:
            (res:any) => {
            if (res.data.length == 0) {
              this.hidesearchlist = false;
              return;
            }
            this.tag = res;
            this.hidesearchlist = true;
            this.showClose = true;
          }
         }
        );

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
    this.enableMobieSearch = false;
    if ((document.getElementById("searchTag") as HTMLInputElement).value == "") {
      this.ClearSearch();
      this._router.navigate(['/']);   
    } else if((document.getElementById("searchTag") as HTMLInputElement).value != "") {
      this.ClearSearch();
      window.location.href = '/';
    }
  }
  RedirectToUser(userId:number){
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
  EnableSearch(){
    this.enableMobieSearch=!this.enableMobieSearch;
  }
  HideMobSearch() {
    this.enableMobieSearch = false;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth >= 1024) {
      this.enableMobieSearch = false;
    }
  }
}

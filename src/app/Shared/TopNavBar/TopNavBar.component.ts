import { Component, Input, OnInit } from '@angular/core';
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { ProfileService } from '../../services/Auth/Profile.service';
import { NavbarCommunicationService } from '../services/NavbarCommunication.service';

@Component({
  selector: 'app-TopNavBar',
  templateUrl: './TopNavBar.component.html',
  styleUrls: ['./TopNavBar.component.css']
})
export class TopNavBarComponent implements OnInit {
user:SocialAuthentication;
navbarUserPic:string='http://res.cloudinary.com/livsolution/image/upload/c_fill,f_auto,g_faces,h_128,q_auto,w_128/DefaultUser_ktw7ga.png';
isLogedIn:boolean=false;
@Input() searchTerm:string;
  constructor(private _profileServices:ProfileService, public navServices:NavbarCommunicationService,) {
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
  }
  Search(val){
    this.searchTerm=val;
  }
    // Suggetion list focous out

    hide(){
      this.navServices.isShowingMenu=false;
   }
   ShowMenu(){
    this.navServices.isShowingMenu=true;
   }
  LogOut(){
    localStorage.clear();
    location.href='/';
  }
}

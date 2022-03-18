import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { ProfileService } from '../../services/Auth/Profile.service';
import {Location} from '@angular/common';
import { SharedService } from '../../services/SharedServices/Shared.service';
import { NavbarCommunicationService } from '../../Shared/services/NavbarCommunication.service';
@Component({
  selector: 'app-UserProfile',
  templateUrl: './UserProfile.component.html',
  styleUrls: ['./UserProfile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userId: number;
  loggedUserId:number;
  loggeduser: SocialAuthentication;
  user: SocialAuthentication;
  constructor(private _userServices: ProfileService
    ,private _location: Location,
    private navServices:NavbarCommunicationService,
    private _sharedServices:SharedService,
    private _router: ActivatedRoute) {
      this._sharedServices.checkInterNetConnection();
    this.userId = this._router.snapshot.params['id'];
    if(localStorage.getItem('user')){
      this.loggeduser= JSON.parse(localStorage.getItem('user'));
      this.loggedUserId=this.loggeduser.Id;
    }
  }

  ngOnInit() {
    this.LoadUserData(this.userId);
  }
  LoadUserData(id: number) {
    this._userServices.GetUserProfile(id).subscribe((data: SocialAuthentication) => {
      this.user = data;
    })
  }

  //Back loacation History
  backClicked() {
    this._location.back();
  }

  hideEvent(){
    this.navServices.Toggle();
 }
}

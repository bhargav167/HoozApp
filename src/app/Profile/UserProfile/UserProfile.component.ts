import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  userId!: number;
  loggedUserId!:number;
  loggeduser!: SocialAuthentication;
  user!: SocialAuthentication;
  constructor(private _userServices: ProfileService
    ,private _location: Location,
    private navServices:NavbarCommunicationService,
    private _sharedServices:SharedService,
    private activatedRoute: ActivatedRoute,
    private _router: Router) {
      this._sharedServices.checkInterNetConnection();
    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = params['target'];
     });
    if(localStorage.getItem('user')){
      this.loggeduser= JSON.parse(localStorage.getItem('user')!);
      this.loggedUserId=this.loggeduser.Id;
    }
  }

  ngOnInit() {
    this.LoadUserData(this.userId);
  }
  LoadUserData(id: number) {
    this._userServices.GetUserProfile(id).subscribe((data: any) => {
      this.user = data;
    })
  }
  Chat(){
    if(this.userId){
      this._router.navigate(['/chatbox'], { queryParams: {uid: this.userId}});
    }else{
      this._router.navigate(['/login'])
    }
    
  }
  //Back loacation History
  backClicked() {
    this._location.back();
  }

  hideEvent(){
    this.navServices.Toggle();
 }
}

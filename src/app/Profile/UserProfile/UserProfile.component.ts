import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { ProfileService } from '../../services/Auth/Profile.service';
@Component({
  selector: 'app-UserProfile',
  templateUrl: './UserProfile.component.html',
  styleUrls: ['./UserProfile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userId: number;
  user: SocialAuthentication;
  constructor(private _userServices: ProfileService,
    private _router: ActivatedRoute) {
    this.userId = _router.snapshot.params['id'];
  }

  ngOnInit() {
    this.LoadUserData(this.userId);
  }
  LoadUserData(id: number) {
    this._userServices.GetUserProfile(id).subscribe((data: SocialAuthentication) => {
      this.user = data; 
    })
  }
}

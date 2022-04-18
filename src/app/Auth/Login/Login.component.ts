import { MapsAPILoader } from '@agm/core';
import { Component, NgZone, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators }  from '@angular/forms';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { ProfileService } from '../../services/Auth/Profile.service';
import { SharedService } from '../../services/SharedServices/Shared.service';
import { HotToastService } from '@ngneat/hot-toast';
@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css']
})
export class LoginComponent implements OnInit {
  loginUser:SocialAuthentication;
  loginForm:FormGroup;

  // Location Variable
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  geoCoder:any;
  constructor(private fb:FormBuilder,
    private _profileServices:ProfileService,
    private _sharedServices:SharedService,
    private apiloader: MapsAPILoader,
    private toast: HotToastService,
    private authService: SocialAuthService) {
      this._sharedServices.checkInterNetConnection();
       _sharedServices.IsUserIsOnLogInPage();
       this.AskForLocation();

    }

  ngOnInit() {
    this.createLoginForm();
  }
  createLoginForm() {
    this.loginForm = this.fb.group({
      UserName:[''],
      Email:[''],
      LoginProvider: [''],
      ImageUrl:[''],
      CoverImageUrl:[''],
      Name:[''],
      MobileNumber:[''],
      Password:[''],
      WebSiteUrl:[''],
      Latitude:[''],
      Longitude:[''],
      UserAddress:[''],
      AboutUs:['']
    })
  }
  AskForLocation(){
    if (navigator.geolocation) {
      let addressLocation=
      navigator.geolocation.getCurrentPosition((position: any) => {
          if (position) {
              this.latitude = position.coords.latitude;
              this.longitude = position.coords.longitude;
                 this.apiloader.load().then(() => {
                  let geocoder = new google.maps.Geocoder;
                  let latlng = {
                      lat: this.latitude,
                      lng: this.longitude
                  };

                  geocoder.geocode({
                      'location': latlng
                  }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                      if (results[1]) {
                          alert("Location: " + results[1].formatted_address);
                      }
                  }
                    else {
                          console.log('Not found');
                      }
                  });
              });


          }else{
            this.showToast();
            return;
          }
      })
  }else{
    this.toast.info('location not supported by this browser', {
      position: 'top-center',
    });
  }
  }
  // Google Login
  signInWithGoogle(): void {
    if(this.latitude && this.longitude){
      this.authService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((data: any) => {
        this.loginForm.controls["Email"].setValue(data.email);
        this.loginForm.controls["Name"].setValue(data.name);
        this.loginForm.controls["ImageUrl"].setValue(data.photoUrl);
        this.loginForm.controls["LoginProvider"].setValue(
          data.provider
        );
        this.loginForm.controls["UserName"].setValue(data.name);
        this.loginForm.controls["Latitude"].setValue(this.latitude);
        this.loginForm.controls["Longitude"].setValue(this.longitude);
        this.loginUser = Object.assign({}, this.loginForm.value);
        this._profileServices
          .Login(this.loginUser)
          .subscribe((data: SocialAuthService) => {
             localStorage.setItem("user", JSON.stringify(data));
             location.href = "/";
          });
      });
    }else{
      this.toast.info('Allow location of you device!', {
        position: 'top-center',
      });
    }
  }
  showToast() {
    this.toast.info('Allow location to use this application', {
      position: 'top-center',
    });
  }
}

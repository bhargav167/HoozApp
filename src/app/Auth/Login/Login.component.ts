import { Component, NgZone, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators }  from '@angular/forms'; 
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { ProfileService } from '../../services/Auth/Profile.service'; 
 

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

  constructor(private fb:FormBuilder,
   
    private _profileServices:ProfileService,
    private authService: SocialAuthService) { 
      if(localStorage.getItem('user')){
        window.location.href='/';
      }else{ 
      }
    }

  ngOnInit() {
    // this.mapsAPILoader.load().then(() => { 
    //   this.geoCoder = new google.maps.Geocoder;
    //  // this.getAddress(25.5538059,84.6583643);
    // });
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
  // Google Login
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((data: any) => {
        this.loginForm.controls['Email'].setValue(data.email);
        this.loginForm.controls['Name'].setValue(data.name);
        this.loginForm.controls['ImageUrl'].setValue(data.photoUrl);
        this.loginForm.controls['LoginProvider'].setValue(data.provider);
        this.loginForm.controls['UserName'].setValue(data.name); 
        this.loginUser = Object.assign({}, this.loginForm.value);
        this._profileServices.Login(this.loginUser).subscribe((data: SocialAuthService) => {
          localStorage.setItem('user', JSON.stringify(data));
          location.href = '/';
        })
      });
  } 

 
  // getAddress(latitude, longitude) {
  //   this.geoCoder.geocode( { 'location': { lat: latitude, lng: longitude } }, (results, status) => {
  //     if (status === 'OK') {
  //       if (results[0]) {
  //         this.zoom = 12;
  //         this.address = results[0].formatted_address;
  //         console.log(this.address);
  //       } else {
  //         window.alert('No results found');
  //       }
  //     } else {
  //       window.alert('Geocoder failed due to: ' + status);
  //     }
    
  //   });
  // }
}

import { HttpClient } from '@angular/common/http';
import { MapsAPILoader } from '@agm/core';
import { Component, NgZone, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators }  from '@angular/forms';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider,FacebookLoginProvider } from "angularx-social-login";
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { ProfileService } from '../../services/Auth/Profile.service';
import { SharedService } from '../../services/SharedServices/Shared.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Meta, Title } from '@angular/platform-browser';
import { state } from '@angular/animations';
var addressLocation='';
var City='';
var State='';
var Country='';
var PinCode='';
@Component({
  selector: "app-Login",
  templateUrl: "./Login.component.html",
  styleUrls: ["./Login.component.css"],
})
export class LoginComponent implements OnInit {
  loginUser!: SocialAuthentication;
  loginForm!: FormGroup;
  isGetLocationOnlOad: boolean = false;
  // Location Variable
  latitude!: number;
  longitude!: number;
  address!: string;
  constructor(
    private titleService: Title, private metaService: Meta,
    private fb: FormBuilder,
    private _profileServices: ProfileService,
    private _sharedServices: SharedService,
    private apiloader: MapsAPILoader,
    private toast: HotToastService,
    private authService: SocialAuthService
  ) {
    this.titleService.setTitle("Login");
    this.metaService.updateTag({property:'og:title',content:'Login new'})
    this._sharedServices.checkInterNetConnection();
    _sharedServices.IsUserIsOnLogInPage();

    this.AskForLocation();
  }

  ngOnInit() {
    this.createLoginForm();
  }
  createLoginForm() {
    this.loginForm = this.fb.group({
      UserName: [""],
      Email: [""],
      LoginProvider: [""],
      ImageUrl: [""],
      CoverImageUrl: [""],
      Name: [""],
      MobileNumber: [""],
      Password: [""],
      WebSiteUrl: [""],
      Latitude: [""],
      Longitude: [""],
      City: [""],
      Country: [""],
      Pincode: [""],
      State: [""],
      UserAddress: [""],
      AboutUs: [""],
    });
  }
  AskForLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.apiloader.load().then(() => {
              let geocoder = new google.maps.Geocoder();
              let latlng = {
                lat: this.latitude,
                lng: this.longitude,
              };

              geocoder.geocode(
                {
                  location: latlng,
                },
                function (results:any, status:any) {
                  if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {

                      addressLocation = results[1].formatted_address;
                      City=results[1].address_components[5].long_name;
                      State=results[1].address_components[7].long_name;
                      Country=results[1].address_components[8].long_name;
                      PinCode=  results[1].address_components[9].long_name;

                    }
                  } else {
                    console.log("Not found");
                  }
                }
              );
            });
            this.isGetLocationOnlOad = true;
          } else {
            this.showToast();
            return;
          }
          },
        (err) => {
          return this.toast.error("Please allow location of your device", {
            position: "top-center",
          });
        }
      );
    } else {
      this.toast.info("location not supported by this browser", {
        position: "top-center",
      });
    }
  }
  // Google Login
  signInWithGoogle(): void {
    this._profileServices.load();
    if (this.isGetLocationOnlOad) {
      this.authService
        .signIn(GoogleLoginProvider.PROVIDER_ID)
        .then((data: any) => {
          this.loginForm.controls["Email"].setValue(data.email);
          this.loginForm.controls["Name"].setValue(data.name);
          this.loginForm.controls["ImageUrl"].setValue(data.photoUrl);
          this.loginForm.controls["LoginProvider"].setValue(data.provider);
          this.loginForm.controls["UserName"].setValue(data.name);
          this.loginForm.controls["Latitude"].setValue(this.latitude);
          this.loginForm.controls["Longitude"].setValue(this.longitude);
          this.loginForm.controls["UserAddress"].setValue(addressLocation);

          this.loginForm.controls["City"].setValue(City);
          this.loginForm.controls["Country"].setValue(Country);
          this.loginForm.controls["State"].setValue(State);
          this.loginForm.controls["Pincode"].setValue(PinCode);
          this.loginUser = Object.assign({}, this.loginForm.value);
          this._profileServices
            .Login(this.loginUser)
            .subscribe((data: any) => {
              localStorage.setItem("user", JSON.stringify(data))!;
              location.href = "/";
            });
        });
    } else {
      this.AskForLocation();
    }
  }
  signInWithFacebook(): void {
    this.authService
      .signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((data: any) => {
        this.loginForm.controls["Email"].setValue(data.email);
        this.loginForm.controls["Name"].setValue(data.name);
        this.loginForm.controls["ImageUrl"].setValue(data.photoUrl);
        this.loginForm.controls["LoginProvider"].setValue(data.provider);
        this.loginForm.controls["UserName"].setValue(data.name);
        this.loginForm.controls["Latitude"].setValue(this.latitude);
        this.loginForm.controls["Longitude"].setValue(this.longitude);
        this.loginForm.controls["UserAddress"].setValue(addressLocation);
        this.loginUser = Object.assign({}, this.loginForm.value);
        this._profileServices
          .Login(this.loginUser)
          .subscribe((data: any) => {
            localStorage.setItem("user", JSON.stringify(data))!;
            location.href = "/";
          });
      });
  }
  // Facebook Login

  showToast() {
    this.toast.info("Allow location to use this application", {
      position: "top-center",
    });
  }
}

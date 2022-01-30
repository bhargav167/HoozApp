import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators }  from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { Tags } from '../../Model/User/Tags';
import { ProfileService } from '../../services/Auth/Profile.service';
import swal from 'sweetalert2';
import {Location} from '@angular/common';
import { SharedService } from '../../services/SharedServices/Shared.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-Edit',
  templateUrl: './Edit.component.html',
  styleUrls: ['./Edit.component.css']
})
export class EditComponent implements OnInit {
  authUser: SocialAuthentication;
  userId:number; 
  userForm:FormGroup;
  Tags:Tags[]=[]; 
  userTag:Tags; 
  tagname:string;
  public imagePath;
  imgURL: any;
  filetoPost:any;

  public btnLoader: boolean;
  showAlert:boolean=false;
  profileImgUploading:boolean=false;
  coverImgUploading:boolean=false;
  
  public message: string;
  public Tagmessage: string;

  ImageUrl:string;
  CoverImageUrl:string; 
  constructor(private _profileServices: ProfileService,
    private _sharedServices:SharedService,
    private fb:FormBuilder,private toast: HotToastService,
    private _router:Router,
    private _location: Location) {
      this._sharedServices.checkInterNetConnection();
  let user= JSON.parse(localStorage.getItem('user'));
  this.userId=user.Id;
  }

  ngOnInit() {  
    this.createUserForm();
    this.loadUserDetais(this.userId); 
  
  }

  showToast() {
    this.toast.success('Profile Updated Successfully', { 
      position: 'top-center', 
    }); 
  }

  createUserForm() {
    this.userForm = this.fb.group({
      UserName:['',Validators.required],
      ImageUrl: [''],
      Email:[''],
      CoverImageUrl: [''],
      Name: ['',[Validators.required,Validators.maxLength(25)]],
      MobileNumber: [''],
      WebSiteUrl: [''],
      Latitude: [''],
      Longitude: [''],
      UserAddress: [''],
      AboutUs: [''],
      tags: [],
      stringTags:['']
    })
  }

  loadUserDetais(userId: number) {
    this._profileServices.GetUserProfile(userId).subscribe((data: SocialAuthentication) => {
      this.authUser = data; 
      this.userForm.controls['ImageUrl'].setValue(this.authUser.ImageUrl);
      this.userForm.controls['Email'].setValue(this.authUser.Email);
      this.userForm.controls['CoverImageUrl'].setValue(this.authUser.CoverImageUrl);
      this.userForm.controls['Name'].setValue(this.authUser.Name);
      this.userForm.controls['MobileNumber'].setValue(this.authUser.MobileNumber);
      this.userForm.controls['UserAddress'].setValue(this.authUser.UserAddress);
      this.userForm.controls['AboutUs'].setValue(this.authUser.AboutUs);
      this.userForm.controls['tags'].setValue(this.authUser.tags);
      this.userForm.controls['Latitude'].setValue(this.authUser.Latitude);
      this.userForm.controls['Longitude'].setValue(this.authUser.Longitude);
      this.userForm.controls['WebSiteUrl'].setValue(this.authUser.WebSiteUrl);
      this.userForm.controls['UserName'].setValue(this.authUser.UserName);
      this.ImageUrl=this.authUser.ImageUrl;
      this.CoverImageUrl=this.authUser.CoverImageUrl;
      this.Tags=this.authUser.tags;
      this.authUser = Object.assign({}, this.userForm.value); 
    })
  }
  // File Upload Cover
  FileUploadCover(files): void {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.CoverImageUrl=this.imgURL;
      this.filetoPost=files;
      this.message = "";
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name); 
    this._profileServices.AddAuthUserCoverImage(this.userId,formData).subscribe((data)=>{
      console.log(data);
    })
  }
  //File Upload User
  FileUploadUser(files): void { 
    if (files.length === 0)
      return;

      this.profileImgUploading=true;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result; 
      this.ImageUrl=this.imgURL;
      this.filetoPost=files;
      this.message = "";
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name); 
    this._profileServices.UpdateUserPhoto(this.userId,formData).subscribe((data)=>{ 
      this.profileImgUploading=false;
    })
  }

  UpdateProfile() { 
    this.btnLoader=true;
    this.authUser=this.userForm.value; 
    this._profileServices.UpdateUser(this.userId, this.authUser).subscribe((data: SocialAuthentication) => {
      this.btnLoader=false;
      this.showAlert=true;
      this.showToast();
      this._router.navigate(['/profile/',this.userId]);
    })
  }
  

  AddTagging() { 
    if(this.userForm.controls['stringTags'].value==''){ 
        this.toast.warning('Tag is required!', { 
          position: 'top-center', 
        });  
      return;
    }
    this.userTag = {
      TagName:   this.userForm.controls['stringTags'].value,
       UserId:this.userId,
    }; 
    this.Tags.push(this.userTag);
    this.userForm.controls['tags'].setValue(this.Tags);
    this.Tagmessage = '';
    this.userForm.controls['stringTags'].setValue(''); 
  }
  RemoveTagging(item) {
    this.Tags = this.Tags.filter(function (obj) {
      return obj.TagName != item;
    });
    this.userForm.controls['tags'].setValue(this.Tags);
  }

  //Reset Profile
  Reset(){
    swal.fire({
      text: `Are you sure to reset`,
      showDenyButton: true, 
      confirmButtonText: 'Yes',
      confirmButtonColor:'#00fa9a', 
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.userForm.reset();
      } else if (result.isDenied) {
        swal.fire('Reset Abort', '', 'info')
      }
    })
   
  }
  
  //Back loacation History
  backClicked() {
    this._location.back();
  }
}

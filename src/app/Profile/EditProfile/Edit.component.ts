import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators }  from '@angular/forms';  
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { Tags } from '../../Model/User/Tags';
import { ProfileService } from '../../services/Auth/Profile.service';

@Component({
  selector: 'app-Edit',
  templateUrl: './Edit.component.html',
  styleUrls: ['./Edit.component.css']
})
export class EditComponent implements OnInit {
  authUser: SocialAuthentication;
  userId:number;
  public btnLoader: boolean;
  userForm:FormGroup;
  Tags:Tags[]=[]; 
  userTag:Tags; 
  public imagePath;
  imgURL: any;
  filetoPost:any;
  showAlert:boolean=false;
  
  public message: string;
  public Tagmessage: string;
  constructor(private _profileServices: ProfileService,private fb:FormBuilder) {
  let user= JSON.parse(localStorage.getItem('user'));
  this.userId=user.Id;
  }

  ngOnInit() {  
    this.createUserForm();
    this.loadUserDetais(this.userId); 
  }

  createUserForm() {
    this.userForm = this.fb.group({
      UserName:[''],
      ImageUrl: [''],
      Email:[''],
      CoverImageUrl: [''],
      Name: [''],
      MobileNumber: [''],
      WebSiteUrl: [''],
      Latitude: [''],
      Longitude: [''],
      UserAddress: [''],
      AboutUs: [''],
      tags: []
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
      this.authUser = Object.assign({}, this.userForm.value);
    })
  }
  public uploadFile = (jobId,files) => {
    if (files.length === 0) {
      return;
    }
 
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
 
  //  this._jobServices.AddPostImages(jobId,formData).subscribe(()=>{

  //  },error=>{
  //    console.log(error);
  //  })
  } 
  FileUpload(files): void {
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
      this.filetoPost=files;
      this.message = "";
    }
  }

  UpdateProfile() {
    // this._profileServices.UpdateUser(this.userId, this.authUser).subscribe((data: SocialAuthentication) => {
      
    // })
  }

  AddTagging() { 
    this.userTag = {
      TagName: this.userForm.controls['tags'].value,
       UserId:1,
    };
    this.Tags.push(this.userTag);
    this.userForm.controls['tags'].setValue(null);
    this.Tagmessage = '';
  }
  RemoveTagging(item) {
    this.Tags = this.Tags.filter(function (obj) {
      return obj.TagName != item;
    });

  }
}

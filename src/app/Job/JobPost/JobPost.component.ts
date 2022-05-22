import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentCanDeactivate } from './../../guard/activate-guard';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder, Validators }  from '@angular/forms';
import { JobModel } from '../../Model/Job/JobModel';
import { JobTags } from '../../Model/Job/JobTags';
import { TagMaster } from '../../Model/TagMaster';
import { JobPostService } from '../../services/JobPost/JobPost.service';
import { HotToastService } from '@ngneat/hot-toast';
import {Location} from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../../services/SharedServices/Shared.service';
import { TagService } from '../../services/Tags/Tag.service';
import { NavbarCommunicationService } from '../../Shared/services/NavbarCommunication.service';
import { MapsAPILoader } from '@agm/core';
function isValid(str){
  return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
 }
 var addressLocation;
@Component({
  selector: 'app-JobPost',
  templateUrl: './JobPost.component.html',
  styleUrls: ['./JobPost.component.scss']
})
export class JobPostComponent implements OnInit,ComponentCanDeactivate {
  public btnLoader: boolean;
  jobPostForm:FormGroup;
  Tags:JobTags[]=[];
  jobTag:JobTags;
  tagMaster:TagMaster;
  jobModel:JobModel;
  public imagePath;
  imgURL: any;
  filetoPost:any;
  public message: string;
  public Tagmessage: string;
  ischeckedAnonymously:boolean=false;
  ischeckedPublic:boolean=true;
  isPostClick:boolean=false;
  userId:number;
  latitude: number;
  longitude: number;
  constructor(private fb:FormBuilder,
    private navServices:NavbarCommunicationService,
    private _jobServices:JobPostService,
    private _tagService:TagService,
    private toast: HotToastService,
    private _router:Router,
    private apiloader: MapsAPILoader,
    private _sharedServices:SharedService,
    private _location: Location) {
      this.AskForLocation();
      window.scrollTo(0,0);
      this._sharedServices.checkInterNetConnection();
    if(localStorage.getItem('user')){
      let user= JSON.parse(localStorage.getItem('user'));
    this.userId=user.Id;
    }else{
      window.location.href='/login';
    }
   }

  ngOnInit() {
    this.createJobPostForm();
    this.isPostClick=false;
  }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if(!this.isPostClick){
      let description= this.jobPostForm.controls['Descriptions'].value;
      if(description!=''){
        return false;
      }else
      return true;
    }else{
      return true;
    }
  }
  createJobPostForm() {
    this.jobPostForm = this.fb.group({
      UserId:[],
      Descriptions: ['',Validators.required],
      Tags:[''],
      ImagesUrl:[''],
      Address:[''],
      Latitude:[''],
      Longitude:[''],
      IsAnonymous:[false],
      IsPublic:[true]
    })
  }

  changePostAnonymously() {
    this.ischeckedAnonymously=!this.ischeckedAnonymously;
    this.jobPostForm.controls['IsAnonymous'].setValue(this.ischeckedAnonymously);
  }
  changePostPublic(){
    this.ischeckedPublic=!this.ischeckedPublic;
    this.jobPostForm.controls['IsPublic'].setValue(this.ischeckedPublic);
  }

  showToast() {
    this.toast.success('Job created Successfully', {
      position: 'top-center',
    });
  }

  AskForLocation(){
    if (navigator.geolocation) {
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
                        addressLocation= results[1].formatted_address;
                        window.document.getElementById('location').innerHTML=addressLocation;
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
  AddJobPost() {
    if(this.Tags.length==0){
      this.toast.warning('Tag is required!', {
        position: 'top-center',
      });
      return;
    }

              this.btnLoader=true;
              this.isPostClick=true;
              this.jobPostForm.controls['UserId'].setValue(this.userId);
              this.jobPostForm.controls['Tags'].setValue(this.Tags);
              this.jobPostForm.controls["Latitude"].setValue(this.latitude);
              this.jobPostForm.controls["Longitude"].setValue(this.longitude);
              this.jobPostForm.controls['IsAnonymous'].setValue(this.ischeckedAnonymously);
              this.jobPostForm.controls['IsPublic'].setValue(this.ischeckedPublic);
              this.jobPostForm.controls['Address'].setValue(addressLocation);
              this.jobModel = Object.assign({}, this.jobPostForm.value);
              this._jobServices.AddJobPost(this.jobModel).subscribe((data: any) => {
                if (this.filetoPost == undefined) {
                  this._jobServices.AddPostImages(data.CreatedJob.Id, null).subscribe(() => {
                  }, error => {
                    console.log(error);
                  })
                  this.jobPostForm.controls['Tags'].setValue('');
                  this.Tags = [];
                  this.Tagmessage = '';
                  this.btnLoader = false;
                  this.imgURL = null;
                  this.showToast();
                  this.jobPostForm.reset();
                  this._router.navigate(['/joblist'], { queryParams: {target: 'MyPost'}});
                } else {
                  this.uploadFile(data.CreatedJob.Id, this.filetoPost);
                }

              }, error => {
                console.log(error);
              })


  }

  public uploadFile = (jobId,files) => {
    if (files.length === 0)
    return;

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
   this._jobServices.AddPostImages(jobId,formData).subscribe(()=>{
    this.jobPostForm.controls['Tags'].setValue('');
    this.Tags=[];
    this.Tagmessage='';
    this.btnLoader=false;
    this.imgURL=null;
    this.jobPostForm.reset();
    this._router.navigate(['/joblist'], { queryParams: {target: 'MyPost'}});
   },error=>{
     console.log(error);
   })
  }

  AddTagging() {
    if(this.jobPostForm.controls['Tags'].value == ''){
      this.toast.warning('Tag is required!', {
        position: 'top-center',
      });
      return;
    }
    this.jobTag = {
      TagName: this.jobPostForm.controls['Tags'].value.trim(),
      TagMasterId: 0
    };
    this.Tags.push(this.jobTag);
    this.Tagmessage = '';

    // Add Tag To TagMaster for Later show suggetions
    this.tagMaster = {
      Id:0,
      TagName: this.jobPostForm.controls['Tags'].value.trim()
    };
    this.jobPostForm.controls['Tags'].setValue(null);
    this._tagService.AddTag(this.tagMaster).subscribe((data)=>{
    },err=>{
      console.log("Tag Adding to master Failed");
    });
  }

  RemoveTagging(item) {
    this.Tags = this.Tags.filter(function (obj) {
      return obj.TagName != item;
    });
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
   //Back loacation History
   backClicked() {
    this._location.back();
  }

  hideEvent(){
    this.navServices.Toggle();
 }
}

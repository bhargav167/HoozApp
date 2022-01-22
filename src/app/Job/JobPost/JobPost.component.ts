import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators }  from '@angular/forms';
import { JobModel } from '../../Model/Job/JobModel';
import { JobTags } from '../../Model/Job/JobTags';
import { JobPostService } from '../../services/JobPost/JobPost.service'; 
import { HotToastService } from '@ngneat/hot-toast';
import {Location} from '@angular/common';
import { Router } from '@angular/router';
function isValid(str){
  return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
 }
@Component({
  selector: 'app-JobPost',
  templateUrl: './JobPost.component.html',
  styleUrls: ['./JobPost.component.css']
})
export class JobPostComponent implements OnInit {
  public btnLoader: boolean;
  jobPostForm:FormGroup;
  Tags:JobTags[]=[]; 
  jobTag:JobTags; 
  jobModel:JobModel;
  public imagePath;
  imgURL: any;
  filetoPost:any; 
  public message: string;
  public Tagmessage: string;
  ischeckedAnonymously:boolean=false;
  ischeckedPublic:boolean=true;
  userId:number;

  
  latitude: number;
  longitude: number;
  constructor(private fb:FormBuilder,
    private _jobServices:JobPostService,
    private toast: HotToastService,
    private _router:Router,
    private _location: Location) {
    if(localStorage.getItem('user')){
      let user= JSON.parse(localStorage.getItem('user'));
    this.userId=user.Id;
    }else{
      window.location.href='/login';
    } 
   }
   
  ngOnInit() {
    this.createJobPostForm(); 
  }
  createJobPostForm() {
    this.jobPostForm = this.fb.group({ 
      UserId:[],
      Descriptions: ['',Validators.required],
      Tags:[''],
      ImagesUrl:[''],
      Address:['Sector 112, Noida Extension, Noida'],
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
  AddJobPost() {
    if(this.Tags.length==0){ 
      this.toast.warning('Tag is required!', { 
        position: 'top-center', 
      }); 
      return;
    } 
    this.btnLoader=true;  
        this.jobPostForm.controls['UserId'].setValue(this.userId);
        this.jobPostForm.controls['Tags'].setValue(this.Tags);
        this.jobPostForm.controls['IsAnonymous'].setValue(this.ischeckedAnonymously);
        this.jobPostForm.controls['IsPublic'].setValue(this.ischeckedPublic);
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
    this.jobPostForm.controls['Tags'].setValue(null);
    this.Tagmessage = '';
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
}
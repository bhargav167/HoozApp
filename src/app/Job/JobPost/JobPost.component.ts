import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators }  from '@angular/forms';   
import { JobModel } from '../../Model/Job/JobModel';
import { JobTags } from '../../Model/Job/JobTags';
import { JobPostService } from '../../services/JobPost/JobPost.service';

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
  showAlert:boolean=false;
  public message: string;
  public Tagmessage: string;
  ischeckedAnonymously:boolean=false;
  ischeckedPublic:boolean=true;
  userId:number;
  constructor(private fb:FormBuilder,private _jobServices:JobPostService) {
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

  AddJobPost() {
    if(this.Tags.length==0){ 
      this.Tagmessage='Tags is Mandatory. Please provide one.';
      return;
    }
    
    this.btnLoader=true;
    this.jobPostForm.controls['UserId'].setValue(this.userId); 
    this.jobPostForm.controls['Tags'].setValue(this.Tags); 
    this.jobModel = Object.assign({}, this.jobPostForm.value); 

    this._jobServices.AddJobPost(this.jobModel).subscribe((data:any)=>{
    this.uploadFile(data.CreatedJob.Id,this.filetoPost);
      this.jobPostForm.controls['Tags'].setValue(''); 
      this.Tags=[];
      this.Tagmessage='';
      this.btnLoader=false;
      this.imgURL=null;
      this.jobPostForm.reset();
      this.showAlert=true;

      setTimeout(() => {
        if (this.showAlert == true) {
          this.showAlert = false;
        }
      }, 3200);
      // Add Job Image
      
   
    },error=>{
      console.log(error);
    }) 
  }

  public uploadFile = (jobId,files) => {
    if (files.length === 0) {
      return;
    }
 
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
 
   this._jobServices.AddPostImages(jobId,formData).subscribe(()=>{

   },error=>{
     console.log(error);
   })
  } 



  AddTagging() { 
    if (!this.jobPostForm.controls['Tags'].value || this.jobPostForm.controls['Tags'].value == ' ')
      return;

    this.jobTag = {
      TagName: this.jobPostForm.controls['Tags'].value,
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
}
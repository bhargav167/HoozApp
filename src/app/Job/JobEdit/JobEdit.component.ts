import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JobModel } from '../../Model/Job/JobModel'; 
import { HotToastService } from '@ngneat/hot-toast';
import { Location } from '@angular/common'; 
import { SharedService } from '../../services/SharedServices/Shared.service';
import { JobPostService } from '../../services/JobPost/JobPost.service';
import { Router } from '@angular/router';
 @Component({
  selector: 'app-JobEdit',
  templateUrl: './JobEdit.component.html',
  styleUrls: ['../JobPost/JobPost.component.scss']
})
export class JobEditComponent implements OnInit {
  public btnLoader: boolean;
  jobPostForm:FormGroup; 
  jobModel:JobModel;
  public imagePath;
  imgURL: any;
  filetoPost:any; 
  public message: string;
  public Tagmessage: string;
  ischeckedAnonymously:boolean=false;
  ischeckedPublic:boolean=true;
  userId:number; 
  editJobId:number=0;
  latitude: number;
  longitude: number;
  constructor(private fb:FormBuilder, 
    private _jobServices:JobPostService,
    private _router:Router,
    private toast: HotToastService, 
    private _sharedServices:SharedService,
    private _location: Location) {
    this._sharedServices.checkInterNetConnection();
    let user= JSON.parse(localStorage.getItem('user'));
    this.userId=user.Id;
   this.editJobId = parseInt(sessionStorage.getItem('EditJobId'));
   }
   
  ngOnInit() {
    this.createJobPostForm(); 
    this.loadJobEditDetails(this.editJobId);
  }
  createJobPostForm() {
    this.jobPostForm = this.fb.group({  
      Descriptions: ['',Validators.required], 
      ImagesUrl:[''],
      Address:['Sector 112, Noida Extension, Noida'],
      Latitude:[''],
      Longitude:[''],
      IsAnonymous:[false], 
      IsPublic:[true]
    }) 
  } 


   loadJobEditDetails(jobId) {
     this._jobServices.GetJobById(jobId).subscribe((data: JobModel) => {
     this.jobModel=data[0];
       this.jobPostForm.controls['Descriptions'].setValue(this.jobModel.Descriptions);
       this.jobPostForm.controls['IsAnonymous'].setValue(this.jobModel.IsAnonymous);
       this.jobPostForm.controls['IsPublic'].setValue(this.jobModel.IsPublic);
       this.jobPostForm.controls['ImagesUrl'].setValue(this.jobModel.ImagesUrl);
       this.ischeckedAnonymously = this.jobModel.IsAnonymous;
       this.ischeckedPublic = this.jobModel.IsPublic;
       this.imgURL = this.jobModel.JobDetailImage;
     })
   }

   public uploadFile = (jobId,files) => {
    if (files.length === 0) 
    return;
 
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name); 
   this._jobServices.AddPostImages(jobId,formData).subscribe(()=>{ 
    this.btnLoader=false; 
    this.showToast();
    this._router.navigate(['/joblist'], { queryParams: {target: 'MyPost'}});
   },error=>{
     console.log(error);
   })
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
 

  changePostAnonymously() {  
    this.ischeckedAnonymously=!this.ischeckedAnonymously; 
    this.jobPostForm.controls['IsAnonymous'].setValue(this.ischeckedAnonymously);
  } 
  changePostPublic(){
    this.ischeckedPublic=!this.ischeckedPublic;
    this.jobPostForm.controls['IsPublic'].setValue(this.ischeckedPublic);
  } 

  showToast() {
    this.toast.success('Job update Successfully', { 
      position: 'top-center', 
    }); 
  }
  AddJobPost() {  
    this.btnLoader=true;  
    this.jobModel = Object.assign({}, this.jobPostForm.value);
    this._jobServices.UpdateJobPost(this.editJobId,this.jobModel).subscribe((data:any)=>{  
      if(this.filetoPost==undefined){
        this.btnLoader = false;
        this._router.navigate(['/joblist'], { queryParams: {target: 'MyPost'}});
        return this.showToast(); 
      } 
      this.uploadFile(this.editJobId, this.filetoPost);
    })
  } 
  
   //Back loacation History
   backClicked() {
    this._location.back();
  }
}

import { Component, OnInit } from '@angular/core';
import { JobResponces } from '../../Model/Job/JobResponces';
import { Pagination } from '../../Model/Pagination';
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { JobPostService } from '../../services/JobPost/JobPost.service';

@Component({
  selector: 'app-JobList',
  templateUrl: './JobList.component.html',
  styleUrls: ['./JobList.component.scss']
})
export class JobListComponent implements OnInit {
jobModel:JobResponces;
jobModels: JobResponces[];
pagination: Pagination;
currentPage: number = 1;
itemsPerPage: number = 4;
user:SocialAuthentication;
userId:number;
isLogedIn:boolean=false;
isLoading:boolean=true;

//Scroll Variable
NotEmptPost:boolean=true;
notScrollY:boolean=true;

// TabToggleTrackVariable
IsOnJob:boolean=true; 
  constructor(private _jobServices:JobPostService) { }

  ngOnInit() {
    if(localStorage.getItem('user')){
      this.user= JSON.parse(localStorage.getItem('user'));
      this.userId=this.user.Id;
      this.isLogedIn=true; 
    }else{
      this.isLogedIn=false;
      window.location.href='/login';
    }
    this.LoadAllWithAddedJob(this.currentPage, this.itemsPerPage); 
  }

  //Load Jobs Post Tab
  LoadAllWithAddedJob(currentPage:number, itemsPerPage:number) {
    this.isLoading=true;
       this._jobServices.GetAllWithAddedJob(currentPage, itemsPerPage).subscribe((res:any) => { 
         this.jobModel = res.result; 
         this.jobModels=res.result.data;
         this.pagination = res.pagination;
        this.isLoading=false;  
       })
     } 

     //Load Post Tab
     LoadAllPost(userId:number ,currentPage:number, itemsPerPage:number) {
      this.isLoading=true;
         this._jobServices.GetPostJob(userId,currentPage, itemsPerPage).subscribe((res:any) => { 
           this.jobModel = res.result; 
           this.jobModels=res.result.data;
           this.pagination = res.pagination;
          this.isLoading=false;  
         })
       } 

     LoadNextPost(){ 
      this.currentPage=this.currentPage+1;
      if(this.IsOnJob==true){
        this._jobServices.GetAllWithAddedJob(this.currentPage, this.itemsPerPage).subscribe((res:any) => { 
          const newData=res.result.data;
          this.isLoading=false; 
          if(newData.length===0){
           this.NotEmptPost=false;
          }
         
         this.jobModels=this.jobModels.concat(newData);
         this.notScrollY=true;
         this.pagination = res.pagination;  
       })
      } else{
        this._jobServices.GetPostJob(this.currentPage, this.itemsPerPage).subscribe((res:any) => { 
          const newData=res.result.data;
          this.isLoading=false; 
          if(newData.length===0){
           this.NotEmptPost=false;
          }
         
         this.jobModels=this.jobModels.concat(newData);
         this.notScrollY=true;
         this.pagination = res.pagination;  
       })
      }
    }
    onScroll(){
      if(this.notScrollY && this.NotEmptPost){
        this.isLoading=true;
        this.notScrollY=false;
        this.LoadNextPost();
      }
    }

    //Checkbox toggle method
    checkValue(event: any){
      this.isLoading=true;
      this.IsOnJob=event;  
      this.currentPage=1;
      this.itemsPerPage=4;
      this.notScrollY=true;
      this.NotEmptPost=true;
      this.jobModels=[];
      this.jobModel=null;
      if(this.IsOnJob==true){
        this.LoadAllWithAddedJob(this.currentPage, this.itemsPerPage); 
      } else{
        this.LoadAllPost(this.user.Id,this.currentPage, this.itemsPerPage);
      }
   }
}

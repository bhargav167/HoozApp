import { Component, OnInit } from '@angular/core';
import { JobResponces } from '../../Model/Job/JobResponces';
import { Pagination } from '../../Model/Pagination';
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { JobPostService } from '../../services/JobPost/JobPost.service';
import { HotToastService } from '@ngneat/hot-toast';
import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-JobList',
  templateUrl: './JobList.component.html',
  styleUrls: ['./JobList.component.scss']
})
export class JobListComponent implements OnInit {
  jobModel: JobResponces;
  jobModels: JobResponces[];
  pagination: Pagination;
  currentPage: number = 1;
  itemsPerPage: number = 4;
  user: SocialAuthentication;
  userId: number;
  isLogedIn: boolean = false;
  isLoading: boolean = false;

  //Scroll Variable
  NotEmptPost: boolean = true;
  notScrollY: boolean = true;

  // TabToggleTrackVariable
  IsOnJob: boolean = true;
  constructor(private _jobServices: JobPostService,
    private activatedRoute: ActivatedRoute, 
    private _location: Location) { 
     this.loadUserData();
    }

  ngOnInit() {
   
  }
  //Load Jobs Post Tab
  LoadAllWithAddedJob(currentPage: number, itemsPerPage: number) {
   
    this._jobServices.GetAllWithAddedJob(this.userId, currentPage, itemsPerPage).subscribe((res: any) => {
      this.jobModel = res.result;
      this.jobModels = res.result.data;
      this.pagination = res.pagination;
      this.isLoading = false; 
    })
  }
  //Load Post Tab
  LoadAllPost(userId: number, currentPage: number, itemsPerPage: number) {  
    this._jobServices.GetPostJob(userId, currentPage, itemsPerPage).subscribe((res: any) => {
      this.jobModel = res.result;
      this.jobModels = res.result.data;
      this.pagination = res.pagination;  
    })
  }

  LoadNextPost() {  
    this.currentPage = this.currentPage + 1; 
    if (this.IsOnJob == true) { 
      
      this._jobServices.GetAllWithAddedJob(this.userId, this.currentPage, this.itemsPerPage).subscribe((res: any) => {
        const newData = res.result.data;
        this.isLoading = false;
        if (newData.length === 0) {
          this.NotEmptPost = false;
        }
      
        this.jobModels = this.jobModels.concat(newData);
        this.notScrollY = true;
        this.pagination = res.pagination;
       
      })
    } else {
      this._jobServices.GetPostJob(this.currentPage, this.itemsPerPage).subscribe((res: any) => {
        const newData = res.result.data;
        this.isLoading = false;
        if (newData.length === 0) {
          this.NotEmptPost = false;
        }
       
        this.jobModels = this.jobModels.concat(newData);
        this.notScrollY = true;
        this.pagination = res.pagination;
      
      })
    }
  }
  onScroll() {
    if (this.notScrollY && this.NotEmptPost) {
      this.isLoading = true;
      this.notScrollY = false; 
      this.LoadNextPost();
    }
  }

  //Checkbox toggle method
  checkValue(event: any) {  
    this.isLoading=false;
    this.IsOnJob = event;
    this.currentPage = 1;
    this.itemsPerPage = 4;
    this.notScrollY = true;
    this.NotEmptPost = true;
    this.jobModels = [];
    this.jobModel = null;
    if (this.IsOnJob == true) {  
      this.LoadAllWithAddedJob(this.currentPage, this.itemsPerPage); 
    } else {   
      this.LoadAllPost(this.user.Id, this.currentPage, this.itemsPerPage); 
    }
  } 

   //Back loacation History
   backClicked() {
    this._location.back();
  }


  //Load Basic User Data
  loadUserData(){
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.userId = this.user.Id;
      this.isLogedIn = true;
      this.activatedRoute.queryParams.subscribe(params => {
        const paramVal = params['target'];
       if(paramVal=='MyPost'){  
       this.checkValue(false);
       }else{  
        this.LoadAllWithAddedJob(this.currentPage, this.itemsPerPage); 
       }
      });
    } else {
      this.isLogedIn = false;
      window.location.href = '/login';
    }
  
  }
}

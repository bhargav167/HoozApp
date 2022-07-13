import { Component, OnInit } from '@angular/core';
import { JobResponces } from '../../Model/Job/JobResponces';
import { Pagination } from '../../Model/Pagination';
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { JobPostService } from '../../services/JobPost/JobPost.service';
import swal from 'sweetalert2';
import { TimeagoIntl } from 'ngx-timeago';
import {strings as englishStrings} from 'ngx-timeago/language-strings/en';
import {Location} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../services/SharedServices/Shared.service';
import { ReportJobService } from '../../services/JobPost/ReportJob.service';
import { NavbarCommunicationService } from '../../Shared/services/NavbarCommunication.service';
@Component({
  selector: 'app-JobList',
  templateUrl: './JobList.component.html',
  styleUrls: ['./JobList.component.scss']
})
export class JobListComponent implements OnInit {
  jobModel!: JobResponces;
  jobModels: any[]=[];
  pagination!: Pagination;
  currentPage: number = 1;
  itemsPerPage: number = 4;
  user!: SocialAuthentication;
  userId!: number;
  isLogedIn: boolean = false;
  isLoading: boolean = false;

  //Scroll Variable
  NotEmptPost: boolean = true;
  notScrollY: boolean = true;

  // TabToggleTrackVariable
  IsOnJob: boolean = true;
  JobStatus:string='OPEN';
  constructor(private _jobServices: JobPostService,
    intl: TimeagoIntl,
    private _reportServices:ReportJobService,
    private navServices:NavbarCommunicationService,
    private activatedRoute: ActivatedRoute,
    private _sharedServices:SharedService,
    private _router:Router,
    private _location: Location) {
      this._sharedServices.checkInterNetConnection();
      intl.strings = englishStrings;
      intl.changes.next();
     this.loadUserData();
    }

  ngOnInit() {
  }

  //Load Jobs Post Tab
  LoadAllWithAddedJob(currentPage: number, itemsPerPage: number,Jobstatus:string) {
    this._jobServices.GetAllWithAddedJob(this.userId, currentPage, itemsPerPage,Jobstatus)
    .subscribe({
      next:(res: any) => {
        this.jobModel = res.result;
        this.jobModels = res.result.data;
        this.pagination = res.pagination;
        this.isLoading = false;
      }
    })

  }
  //Load Post Tab
  LoadAllPost(userId: number, currentPage: number, itemsPerPage: number,Jobstatus:string) {
    this._jobServices.GetPostJob(userId, currentPage, itemsPerPage,Jobstatus)
    .subscribe({
      next:(res: any) => {
        this.jobModel = res.result;
        this.jobModels = res.result.data;
        this.pagination = res.pagination;
        if(this.jobModels.length===0){
          this.NotEmptPost = false;
        }
      }
    })
  }

  LoadNextPost() {
    this.currentPage = this.currentPage + 1;
    if (this.IsOnJob == true) {

      this._jobServices.GetAllWithAddedJob(this.userId, this.currentPage, this.itemsPerPage,this.JobStatus).subscribe((res: any) => {
        const newData = res.result.data;
        this.isLoading = false;
        if (newData.length === 0) {
          this.NotEmptPost = false;
        }

        this.jobModels = this.jobModels.concat(newData);
        this.notScrollY = true;
        this.pagination = res.pagination;

      },err=>{
        this.isLoading=false;
      })
    } else { 
      this._jobServices.GetPostJob(this.userId,this.currentPage, this.itemsPerPage,this.JobStatus).subscribe((res: any) => {
        const newData = res.result.data;
        this.isLoading = false;
        if (newData.length === 0) {
          this.NotEmptPost = false;
        }

        this.jobModels = this.jobModels.concat(newData);
        this.notScrollY = true;
        this.pagination = res.pagination;

      },err=>{
        this.isLoading=false;
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

    // Job Added
    AddToJob(jobId:number){
      swal.fire({
        text: `Confirm to add Job Post Id: ${jobId}`,
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          let userJob={
            jobModelId:jobId,
            socialAuthenticationId:this.userId
          };
          swal.fire({
            text:'Please wait.. Adding job',
            showConfirmButton:false,
            icon:'info'
          })
          this._jobServices.AddJobToUser(userJob).subscribe((data:any)=>{
            swal.fire(`Job ${jobId} Added successfully!`, '', 'success')
          },err=>{
            console.log(err);
          })
        } else if (result.isDenied) {

        }
      })
    }

    //Report Job
    Report(jobId:number){
      swal.fire({
        title: `Report Post`,
        input: 'textarea',
        showDenyButton: true,
        confirmButtonText: 'Report',
        denyButtonText: `Cancel`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          let reportJob={
            jobModelId:jobId,
            socialAuthenticationId:this.userId,
            Isusue:result.value
          };
          swal.fire({
            text:'Please wait... Reporting',
            showConfirmButton:false,
            icon:'info'
          })
          this._reportServices.ReportJob(reportJob).subscribe((data:any)=>{
            swal.fire(`Job ${jobId} Reported!`, '', 'success')
          },err=>{
            console.log(err);
          })
        } else if (result.isDenied) {

        }
      })
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
    //this.jobModel = null;
    if (this.IsOnJob == true) {
      this.LoadAllWithAddedJob(this.currentPage, this.itemsPerPage,this.JobStatus);
    } else {
      this.LoadAllPost(this.user.Id, this.currentPage, this.itemsPerPage,this.JobStatus);
    }
  }
  //Job status dropdown
  JobStatusChange($event:any){
    this.JobStatus=$event.target.value.trim();
    this.currentPage=1;
    this.itemsPerPage=4;
    if(this.IsOnJob==true){
      this.LoadAllWithAddedJob(this.currentPage, this.itemsPerPage,this.JobStatus);
    }else{
      this.LoadAllPost(this.user.Id,this.currentPage, this.itemsPerPage,this.JobStatus);
    }
  }

   //Back loacation History
   backClicked() {
    this._location.back();
  }


  //Load Basic User Data
  loadUserData(){
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user')!);
      this.userId = this.user.Id;
      this.isLogedIn = true;
      this.activatedRoute.queryParams.subscribe(params => {
        const paramVal = params['target'];
       if(paramVal=='MyPost'){
       this.checkValue(false);
       }else{
        this.LoadAllWithAddedJob(this.currentPage, this.itemsPerPage,this.JobStatus);
       }
      });
    } else {
      this.isLogedIn = false;
      window.location.href = '/login';
    }

  }
  hideEvent(){
    this.navServices.Toggle();
 }
 RedirectToJob(jobId:number,recipientId:number){

  this._router.navigate([`/jobDetails/${jobId}`], { queryParams: {target: jobId,senderId:this.userId,recipientId:recipientId}});
 // this._router.navigate(['/jobDetails'], { queryParams: {target: jobId}});
}
}

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobModel } from '../../Model/Job/JobModel'; 
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { JobPostService } from '../../services/JobPost/JobPost.service';
import {Location} from '@angular/common';
import swal from 'sweetalert2';
import { UserJobs } from '../../Model/Job/UserJobs'; 
import { ReportJobService } from '../../services/JobPost/ReportJob.service';
import { SharedService } from '../../services/SharedServices/Shared.service';

@Component({
  selector: 'app-JobDetail',
  templateUrl: './JobDetail.component.html',
  styleUrls: ['./JobDetail.component.scss']
})
export class JobDetailComponent implements OnInit {
job:JobModel; 
jobId:number=0;
loggedUserId:number=0;
loggeduser: SocialAuthentication;
userJob:UserJobs; 
  constructor(private _jobServices:JobPostService,
    private _reportServices:ReportJobService,
    private _sharedServices:SharedService,
    private _navigaterouter:Router,
    private _router:ActivatedRoute,private _location: Location) {
      this._sharedServices.checkInterNetConnection();
     
      if(localStorage.getItem('user')){
        this.loggeduser= JSON.parse(localStorage.getItem('user')); 
        this.loggedUserId=this.loggeduser.Id;
      }
     
      this.jobId= this._router.snapshot.params['id'];
    this.LoadJobDetailsById(this.jobId); 
  }

  ngOnInit() { 
  }
  LoadJobDetailsById(id:number){
    this._jobServices.GetJobById(id).subscribe((data:JobModel)=>{
      this.job=data[0];  
    }) 
  }

  //Job status update
  UpdateStatus($event){
    swal.fire({
      text: `Are you sure to update status to ${$event.target.value}`,
      showDenyButton: true, 
      confirmButtonText: 'Yes',
      confirmButtonColor:'#00fa9a', 
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this._jobServices.UpdateJobStatus(this.jobId,$event.target.value).subscribe(()=>{
          swal.fire('Job status updated successfully!', '', 'success')
        },err=>{
          console.log(err);
        }) 
      } else if (result.isDenied) {
        swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
  

  // Job Added
  AddToJob(){
    swal.fire({
      text: `Confirm to add Job Post Id: ${this.job.Id}`,
      showDenyButton: true, 
      confirmButtonText: 'Yes',
      confirmButtonColor:'#00fa9a', 
      denyButtonText: `No`,
      denyButtonColor:'black'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let userJob={
          jobModelId:this.jobId,
          socialAuthenticationId:this.loggedUserId
        };  
        swal.fire({
          text:'Please wait.. Adding job',
          showConfirmButton:false,
          icon:'info'
        })
        this._jobServices.AddJobToUser(userJob).subscribe((data:any)=>{ 
          swal.fire(`Job ${this.job.Id} Added successfully!`, '', 'success')
        },err=>{
          console.log(err);
        }) 
      } else if (result.isDenied) {
        swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  //Edit Job
  Edit(jobId){
  sessionStorage.setItem("EditJobId",jobId);
  this._navigaterouter.navigate(['/jobEdit'])
  }
  Report(){
    swal.fire({
      title: `Report`,
      input: 'textarea',
      showDenyButton: true, 
      confirmButtonText: 'Report',
      confirmButtonColor:'#00fa9a', 
      denyButtonText: `Cancel`,
      denyButtonColor:'black'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let reportJob={
          jobModelId:this.jobId,
          socialAuthenticationId:this.loggedUserId,
          Isusue:result.value
        };   
        swal.fire({
          text:'Please wait... Reporting',
          showConfirmButton:false,
          icon:'info'
        })
        this._reportServices.ReportJob(reportJob).subscribe((data:any)=>{ 
          swal.fire(`Job ${this.job.Id} Reported!`, '', 'success')
        },err=>{
          console.log(err);
        }) 
      } else if (result.isDenied) {
        swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
  //Back loacation History
  backClicked() {
    this._location.back();
  }
}

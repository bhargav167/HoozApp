import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobModel } from '../../Model/Job/JobModel';
import { JobResponces } from '../../Model/Job/JobResponces';
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { JobPostService } from '../../services/JobPost/JobPost.service';
import {Location} from '@angular/common';
import swal from 'sweetalert2';
@Component({
  selector: 'app-JobDetail',
  templateUrl: './JobDetail.component.html',
  styleUrls: ['./JobDetail.component.scss']
})
export class JobDetailComponent implements OnInit {
job:JobModel; 
jobId:number;
loggedUserId:number;
loggeduser: SocialAuthentication;
  constructor(private _jobServices:JobPostService,private _router:ActivatedRoute,private _location: Location) {
    if(localStorage.getItem('user')){
      this.loggeduser= JSON.parse(localStorage.getItem('user')); 
      this.loggedUserId=this.loggeduser.Id;
    }else{ 
    }
  }

  ngOnInit() {
  this.jobId= this._router.snapshot.params['id'];
    this.LoadJobDetailsById(this.jobId); 
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

  //Back loacation History
  backClicked() {
    this._location.back();
  }
}

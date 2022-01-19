import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobModel } from '../../Model/Job/JobModel';
import { JobResponces } from '../../Model/Job/JobResponces';
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { JobPostService } from '../../services/JobPost/JobPost.service';

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
  constructor(private _jobServices:JobPostService,private _router:ActivatedRoute) {
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
}

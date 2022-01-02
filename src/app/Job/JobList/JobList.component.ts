import { Component, OnInit } from '@angular/core';
import { JobModel } from '../../Model/Job/JobModel';
import { JobResponces } from '../../Model/Job/JobResponces';
import { JobPostService } from '../../services/JobPost/JobPost.service';

@Component({
  selector: 'app-JobList',
  templateUrl: './JobList.component.html',
  styleUrls: ['./JobList.component.css']
})
export class JobListComponent implements OnInit {
jobModel:JobResponces;
isLoading:boolean=true;
  constructor(private _jobServices:JobPostService) { }

  ngOnInit() {
    this.isLoading=true;
    this._jobServices.GetAllJob().subscribe((data:JobResponces)=>{
      this.jobModel=data;
      this.isLoading=false;  
    })
  }

}

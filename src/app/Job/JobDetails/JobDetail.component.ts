import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobModel } from '../../Model/Job/JobModel';
import { JobResponces } from '../../Model/Job/JobResponces';
import { JobPostService } from '../../services/JobPost/JobPost.service';

@Component({
  selector: 'app-JobDetail',
  templateUrl: './JobDetail.component.html',
  styleUrls: ['./JobDetail.component.css']
})
export class JobDetailComponent implements OnInit {
job:JobModel;
  constructor(private _jobServices:JobPostService,private _router:ActivatedRoute) { }

  ngOnInit() {
    let ids= this._router.snapshot.params['id'];
    this.LoadJobDetailsById(ids); 
  }
  LoadJobDetailsById(id:number){
    this._jobServices.GetJobById(id).subscribe((data:JobModel)=>{
      this.job=data[0];
      console.log(this.job);
    }) 
  }
}

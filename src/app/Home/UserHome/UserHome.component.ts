import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/Admin/Admin.service';

@Component({
  selector: 'app-UserHome',
  templateUrl: './UserHome.component.html',
  styleUrls: ['./UserHome.component.css']
})
export class UserHomeComponent implements OnInit {
sets:any[]=[];
jobsets:any[]=[];
IsLoaded=false;
  constructor(private _adminServices:AdminService,private _navigaterouter: Router) { }

  ngOnInit() {
    this.IsLoaded=false;
    this.LoadSets();
  }
 async LoadSets(){
    this._adminServices.GetAllSets().subscribe((data:any)=>{
      this.sets=data;
      console.log(this.sets);
    })
  }

  // loadSetJobs(setId:number){
  //   this._adminServices.GetAllJobSets(setId).subscribe((data:any)=>{
  //     console.log(data);
  //   })
  // }
}

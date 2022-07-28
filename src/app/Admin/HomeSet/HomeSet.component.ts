import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/Admin/Admin.service';

@Component({
  selector: 'app-HomeSet',
  templateUrl: './HomeSet.component.html',
  styleUrls: ['./HomeSet.component.css']
})
export class HomeSetComponent implements OnInit {
  setName:string='';
  jobId:string='';
  loading:boolean=false;
  constructor(private _adminServices:AdminService,    private _navigaterouter: Router) {
    let user=JSON.parse(localStorage.getItem('user')!);
    if(user.Email!='bhargav.kshitiz55kk@gmail.com')
    this._navigaterouter.navigateByUrl('/');
  }

  ngOnInit() {
  }


  Create(){
    if(this.setName=='' || this.jobId=='')
    return alert('All field are mandatory');

    this.loading=true;
  let sets={
    Name:this.setName,
    JobId:this.jobId
  }
  this._adminServices.PostSets(sets).subscribe((data:any)=>{
    this.setName='';
    this.jobId='';
    alert("Sets Created.");
    this.loading=false;
  })
  }
}

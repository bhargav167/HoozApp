import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserChatService } from '../../services/Chat/User/UserChat.service';
import { JobResponcesService } from '../../services/JobPost/JobResponces.service';
import { SharedService } from '../../services/SharedServices/Shared.service';

@Component({
  selector: 'app-JobResponce',
  templateUrl: './JobResponce.component.html',
  styleUrls: ['./../../ChatModule/Chats/Chats.component.css']
})
export class JobResponceComponent implements OnInit {
  userId:number;
  userlist:any;
  jobId:number;
  constructor(private _jobresponceServices: JobResponcesService,  private activatedRoute: ActivatedRoute, private _sharedServices:SharedService, private _navigaterouter:Router) {
    this._sharedServices.checkInterNetConnection();
    let user= JSON.parse(localStorage.getItem('user'));
    this.userId=user.Id;
    this.activatedRoute.queryParams.subscribe(params => {
      this.jobId = params['target'];

     });
  }
  ngOnInit(){
    this.LoadUserChatList();
  }

  LoadUserChatList() {
    this._jobresponceServices.GetJobResponces(this.jobId, this.userId).subscribe((data:any)=>{
      this.userlist=data;
      console.log(this.userlist);
    })
  }

RedirectToUser(userId){
  this._navigaterouter.navigate(['/profile'], { queryParams: {target: userId}});
}
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobResponcesService } from '../../services/JobPost/JobResponces.service';
import { SharedService } from '../../services/SharedServices/Shared.service';

@Component({
  selector: 'app-JobResponce',
  templateUrl: './JobResponce.component.html',
  styleUrls: ['./../../ChatModule/Chats/Chats.component.css']
})
export class JobResponceComponent implements OnInit {
  userId!:number;
  userlist!:any;
  jobId!:number;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  @Output() notifySender: EventEmitter<number> = new EventEmitter();
  constructor(private _jobresponceServices: JobResponcesService,  private activatedRoute: ActivatedRoute, private _sharedServices:SharedService, private _navigaterouter:Router) {
    this._sharedServices.checkInterNetConnection();
    let user= JSON.parse(localStorage.getItem('user')!);
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
    })
  }
  RedirectToJob(senderId:number){
    this.notifyParent.emit(false);
    this.notifySender.emit(senderId);
  }
RedirectToUser(userId:number){
  this._navigaterouter.navigate(['/profile'], { queryParams: {target: userId}});
}

}

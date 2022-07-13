import { SocialAuthentication } from './../../Model/User/SocialAuthentication';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SignalrService } from '../../services/signalr.service';
import { TimeagoIntl } from 'ngx-timeago';
import {strings as englishStrings} from 'ngx-timeago/language-strings/en';
import { JobPostService } from '../../services/JobPost/JobPost.service';
import { JobModel } from '../../Model/Job/JobModel'; 
import { JobChatService } from '../../services/Chat/JobChat/JobChat.service';
import { HotToastService } from '@ngneat/hot-toast';
@Component({
  selector: 'app-JobChat',
  templateUrl: './JobChat.component.html',
  styleUrls: ['./../Chatbox/Chatbox.component.scss']
})
export class JobChatComponent implements OnInit {
  senderId!: number;
  recipientId!: number;
  jobId!:number;
  job!:JobModel;
  user!: SocialAuthentication;
  messages: Array<any>=[];
  jobMessages:any[]=[];
  isSending:boolean=false;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  constructor(
    intl: TimeagoIntl,
    private _jobServices:JobPostService,
    private _jobchatServices:JobChatService,
    public _signalR:SignalrService,
    private route: ActivatedRoute,
    private toast: HotToastService
  ) {
    intl.strings = englishStrings;
    intl.changes.next();
    let user = JSON.parse(localStorage.getItem("user")!);
    this.route.queryParams.subscribe((params) => {
      this.jobId = params["target"];
      if(sessionStorage.getItem('senderId')==null){
        this.senderId = params["senderId"];
      }else{
        this.senderId = parseInt(sessionStorage.getItem('senderId')!);
      }
      this.recipientId = params["recipientId"];
    });
    this.LoadJobDetailsById();
    this.getJobChat();
    this.UpdateSeenResponces();
  }
  ngOnInit() {
    setInterval(()=>{
      this.getJobChat();
    },2000)
  }
  getJobChat(){
    this._jobchatServices.getJobchatList(this.jobId,this.senderId,this.recipientId).subscribe((data:any)=>{
      this.jobMessages=data;
    })
  }
  LoadJobDetailsById(){
    this._jobServices.GetJobById(this.jobId).subscribe((data:any)=>{
      this.job=data[0];
    })
  }

  SendMsg():any {
    let message = (document.getElementById("msg") as HTMLInputElement).value;
    if(message=="")
    return this.toast.info('please type to send.', {
      position: 'top-center',
    });
    this.isSending=true;

    let messageObj = {
      JobId:this.jobId,
      SenderId: this.senderId,
      SenderContent:message,
      RecipientId: this.recipientId,
      Content: message,
      MessageSent:new Date()
    };
    this._signalR.broadcastJobMessage(messageObj);
    (document.getElementById("msg") as HTMLInputElement).value="";
     this._signalR.sendMessageToJobApi(this.jobId,this.recipientId,this.senderId,messageObj).subscribe((data:any)=>{
       this.isSending=false;

     },err=>{
       this.isSending=false;

     })
  }

  UpdateSeenResponces(){
    this._jobchatServices.updateJobReponcesCount(this.jobId,this.senderId,this.recipientId).subscribe(()=>{});
  }
   //Back loacation History
   backClicked() {
    this.notifyParent.emit(false);
  }
}
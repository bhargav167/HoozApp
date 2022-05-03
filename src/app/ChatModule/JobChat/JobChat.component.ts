import { SocialAuthentication } from './../../Model/User/SocialAuthentication';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SignalrService } from '../../services/signalr.service';
import {Location} from '@angular/common';
import { TimeagoIntl } from 'ngx-timeago';
import {strings as englishStrings} from 'ngx-timeago/language-strings/en';
import { JobPostService } from '../../services/JobPost/JobPost.service';
import { JobModel } from '../../Model/Job/JobModel';
import { JobMessages } from '../../Model/Message/JobMessages';
import { JobChatService } from '../../services/Chat/JobChat/JobChat.service';

@Component({
  selector: 'app-JobChat',
  templateUrl: './JobChat.component.html',
  styleUrls: ['./../Chatbox/Chatbox.component.css']
})
export class JobChatComponent implements OnInit {
  senderId: number;
  recipientId: number;
  jobId:number;
  job:JobModel;
  user: SocialAuthentication;
  messages: Array<any>=[];
  jobMessages:any[];
  isSending:boolean=false;
  constructor(
    intl: TimeagoIntl,
    private _jobServices:JobPostService,
    private _jobchatServices:JobChatService,
    public _signalR:SignalrService,
    private route: ActivatedRoute,
    private _location: Location
  ) {
    intl.strings = englishStrings;
    intl.changes.next();
    let user = JSON.parse(localStorage.getItem("user"));
    this.route.queryParams.subscribe((params) => {
      this.jobId = params["jobId"];
      this.senderId = params["senderId"];
      this.recipientId = params["recipientId"];
    });
    this.LoadJobDetailsById();
    this.getJobChat();
    this.UpdateSeenResponces();
  }
  ngOnInit() {
   // this._signalR.connect();
  }
  getJobChat(){
    this._jobchatServices.getJobchatList(this.jobId,this.senderId,this.recipientId).subscribe((data:any[])=>{
      this.jobMessages=data;

    })
  }
  LoadJobDetailsById(){
    this._jobServices.GetJobById(this.jobId).subscribe((data:JobModel)=>{
      this.job=data[0];
    })
  }

  SendMsg() {
    this.isSending=true;
    let message = (document.getElementById("msg") as HTMLInputElement).value;
    let messageObj = {
      JobId:this.jobId,
      SenderId: this.senderId,
      SenderContent:message,
      RecipientId: this.recipientId,
      Content: message,
      MessageSent:new Date()
    };
    this.jobMessages.push(messageObj);
    (document.getElementById("msg") as HTMLInputElement).value="";
    this._signalR.sendMessageToJobApi(this.jobId,this.recipientId,this.senderId,messageObj).subscribe((data:JobMessages)=>{
      this.isSending=false;

    },err=>{
      this.isSending=false;

    })
  }

  UpdateSeenResponces(){
    this._jobchatServices.updateJobReponcesCount(this.jobId,this.recipientId,this.senderId).subscribe(()=>{});
  }
   //Back loacation History
   backClicked() {
    this._location.back();
  }
}

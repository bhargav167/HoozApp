import { MessageForCreationDto } from './../../Model/Message/MessageForCreationDto';
import { SocialAuthentication } from './../../Model/User/SocialAuthentication';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/Auth/Profile.service';
import { UserChatService } from '../../services/Chat/User/UserChat.service';
import { SignalrService } from '../../services/signalr.service';
import {Location} from '@angular/common';
import { TimeagoIntl } from 'ngx-timeago';
import {strings as englishStrings} from 'ngx-timeago/language-strings/en';
import { HotToastService } from '@ngneat/hot-toast';
import { RealChatDtos } from '../../Model/Message/RealChatDtos';
@Component({
  selector: "app-Chatbox",
  templateUrl: "./Chatbox.component.html",
  styleUrls: ["./Chatbox.component.scss"],
})
export class ChatboxComponent implements OnInit {
  senderId: number;
  recipientId: number;
  user: SocialAuthentication;
  messages: Array<any>;
  isSending:boolean=false;
  checkIsSend:boolean=false;
  isOnline:boolean=false;
  LastActive:Date;
  constructor(
    intl: TimeagoIntl,
    private _profileDetails: ProfileService,
    private _chatServices: UserChatService,
    private _signalR:SignalrService,
    private route: ActivatedRoute,
    private _location: Location,
    private toast: HotToastService
  ) {
    intl.strings = englishStrings;
    intl.changes.next();
    let user = JSON.parse(localStorage.getItem("user"));
    this.recipientId = user.Id;
    this.route.queryParams.subscribe((params) => {
      this.senderId =parseInt(params["uid"]);
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.loadUserChat();
    this.IsOnline();
    setInterval(()=>{
     this.loadUserChat();
     this.IsOnline();
    },2000)

    this._signalR.retrieveMappedObject().subscribe( (receivedObj: RealChatDtos) => {  this.addToInbox(receivedObj);});
  }
  msgDto: RealChatDtos = new RealChatDtos();
  msgInboxArray: RealChatDtos[] = [];
  loadUserData() {
    this._profileDetails
      .GetUserProfile(this.senderId)
      .subscribe((data: SocialAuthentication) => {
        this.user = data;
      });
  }
  loadUserChat() {
    this._chatServices
      .getMessages(this.senderId, this.recipientId)
      .subscribe((data: any[]) => {
        this.msgInboxArray = data;
      });
  }
  IsOnline(){
    this._profileDetails.IsOnline(this.senderId).subscribe((data:any)=>{
      this.isOnline=data.IsOnline;
      this.LastActive=data.LastActive;
    })
  }
  SendMsg() {
    let message = (document.getElementById("msg") as HTMLInputElement).value;
    if(message=="")
    return  this.toast.info('please type to send.', {
      position: 'top-center',
    });
   this.isSending=true;
    this.msgDto = {
      SenderId: this.senderId,
      RecipientId: this.recipientId,
      Content: message,
      RecipientContent:null,
      SenderContent:message,
      MessageSent:new Date()
    };

    (document.getElementById("msg") as HTMLInputElement).value="";
    this._signalR.mapReceivedMessage(this.msgDto);
     this._signalR.sendMessageToApi(this.senderId,this.msgDto).subscribe((data:MessageForCreationDto)=>{
       this.isSending=false;
       this.checkIsSend=true;

     },err=>{
      this.isSending=false;

     })
  }
  addToInbox(obj: RealChatDtos) {
    let newObj = new RealChatDtos();
    newObj.SenderId = obj.SenderId;
    newObj.SenderContent = obj.SenderContent;
    newObj.RecipientId = obj.RecipientId;
    newObj.RecipientContent = obj.RecipientContent;
    newObj.Content = obj.Content;
    newObj.MessageSent=new Date();
    this.msgInboxArray.push(newObj);
  }
   //Back loacation History
   backClicked() {
    this._location.back();
  }
}

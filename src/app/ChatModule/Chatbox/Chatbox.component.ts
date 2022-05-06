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
@Component({
  selector: "app-Chatbox",
  templateUrl: "./Chatbox.component.html",
  styleUrls: ["./Chatbox.component.css"],
})
export class ChatboxComponent implements OnInit {
  senderId: number;
  recipientId: number;
  user: SocialAuthentication;
  messages: Array<any>;
  isSending:boolean=false;
  constructor(
    intl: TimeagoIntl,
    private _profileDetails: ProfileService,
    private _chatServices: UserChatService,
    public _signalR:SignalrService,
    private route: ActivatedRoute,
    private _location: Location,
    private toast: HotToastService
  ) {
    intl.strings = englishStrings;
    intl.changes.next();
    let user = JSON.parse(localStorage.getItem("user"));
    this.recipientId = user.Id;
    this.route.queryParams.subscribe((params) => {
      this.senderId = params["uid"];
    });
  }

  ngOnInit() {
   this._signalR.connect();
    this.loadUserData();
    this.loadUserChat();
  }
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
        this.messages = data;
      });
  }
  SendMsg() {
    let message = (document.getElementById("msg") as HTMLInputElement).value;
    if(message=="")
    return  this.toast.info('please type to send.', {
      position: 'top-center',
    });
    this.isSending=true;


    let messageObj = {
      SenderId: this.senderId,
      RecipientId: this.recipientId,
      Content: message,
      RecipientContent:null,
      SenderContent:message,
      MessageSent:new Date()
    };
    this.messages.push(messageObj);
    (document.getElementById("msg") as HTMLInputElement).value="";
    this._signalR.sendMessageToApi(this.senderId,messageObj).subscribe((data:MessageForCreationDto)=>{
      this.isSending=false;

    },err=>{
      this.isSending=false;

    })
  }
   //Back loacation History
   backClicked() {
    this._location.back();
  }
}

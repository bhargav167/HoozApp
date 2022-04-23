import { MessageForCreationDto } from './../../Model/Message/MessageForCreationDto';
import { SocialAuthentication } from './../../Model/User/SocialAuthentication';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/Auth/Profile.service';
import { UserChatService } from '../../services/Chat/User/UserChat.service';

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
    private _profileDetails: ProfileService,
    private _chatServices: UserChatService,
    private route: ActivatedRoute
  ) {
    let user = JSON.parse(localStorage.getItem("user"));
    this.recipientId = user.Id;
    this.route.queryParams.subscribe((params) => {
      this.senderId = params["uid"];
    });
  }

  ngOnInit() {
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
    this.isSending=true;

    let message = (document.getElementById("msg") as HTMLInputElement).value;
    let messageObj = {
      SenderId: this.senderId,
      RecipientId: this.recipientId,
      Content: message,
      RecipientContent:null,
      SenderContent:message
    };
    this.messages.push(messageObj);
    (document.getElementById("msg") as HTMLInputElement).value="";
    this._chatServices.SendMessage(this.senderId,messageObj).subscribe((data:MessageForCreationDto)=>{
      this.isSending=false;

    },err=>{
      this.isSending=false;

    })
  }
}

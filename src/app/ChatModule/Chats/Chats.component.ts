import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserChatService } from '../../services/Chat/User/UserChat.service';
import { SharedService } from '../../services/SharedServices/Shared.service';

@Component({
  selector: "app-Chats",
  templateUrl: "./Chats.component.html",
  styleUrls: ["./Chats.component.css"],
})
export class ChatsComponent implements OnInit {
  userId:number;
  userlist:any;
  constructor(private _userchatServices: UserChatService, private _sharedServices:SharedService, private _navigaterouter:Router) {
    this._sharedServices.checkInterNetConnection();
    let user= JSON.parse(localStorage.getItem('user')!);
    this.userId=user.Id;

  }
  ngOnInit(){
    this.LoadUserChatList();
  }

  LoadUserChatList() {
    this._userchatServices.getUserchatList(this.userId).subscribe((data:any)=>{
      this.userlist=data.data;
    })
  }

RedirectToUser(userId:number){
  this._navigaterouter.navigate(['/profile'], { queryParams: {target: userId}});
}
}

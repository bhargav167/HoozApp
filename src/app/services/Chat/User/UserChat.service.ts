import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MessageForCreationDto } from '../../../Model/Message/MessageForCreationDto';

@Injectable({
  providedIn: 'root'
})
export class UserChatService {
  baseURL=environment.api_url;
  constructor(private _http:HttpClient) {  }
  SendMessage(userid:number, message:MessageForCreationDto){
   return this._http.post(environment.api_url+'Message/Send/'+userid,message)
  }
  getUserchatList(loggedUserId:number){
   return this._http.get(environment.api_url+'Message/AllChatsUser/'+loggedUserId);
  }
  getMessages(senderId:number,recipientId:number){
    return this._http.get(environment.api_url+'Message/UserChat/'+senderId+'/'+recipientId);
  }
}

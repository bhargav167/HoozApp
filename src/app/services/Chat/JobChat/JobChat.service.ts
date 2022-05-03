import { environment } from './../../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobChatService {
  baseURL=environment.api_url;
  constructor(private _http:HttpClient) {  }

  getJobchatList(jobId:number,senderId:number,recipientId:number){
   return this._http.get(environment.api_url+'Message/GetSingleUserChatByJob/'+jobId+'/'+senderId+'/'+recipientId);
  }
  updateJobReponcesCount(jobId:number,senderId:number,recipentId:number){
    return this._http.post(environment.api_url+'Message/JobUserMessageResponceUpdate/'+jobId+'/'+senderId+'/'+recipentId,{});
  }
}

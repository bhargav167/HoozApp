import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseURL=environment.api_url;
  constructor(private _http:HttpClient) {  }
  GetUserProfile(id:number){
    return this._http.get(this.baseURL+'User/UserById/'+id);
  }
  UpdateUser(id:number,user:SocialAuthentication){
    return this._http.post(this.baseURL+'User/'+id,user);
  }
  Login(user:SocialAuthentication){
    return this._http.post(this.baseURL+'AuthLogin/AddAuthUser',user);
  }
}
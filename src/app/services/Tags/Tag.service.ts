import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TagMaster } from '../../Model/TagMaster';
@Injectable({
  providedIn: 'root'
})
export class TagService {
  baseURL=environment.api_url;
  constructor(private _http:HttpClient) {  }
  AddTag(tag:TagMaster){
    return  this._http.post(this.baseURL + 'Tag/AddTagMaster',tag); 
    } 
}

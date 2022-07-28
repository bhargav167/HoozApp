import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseURL=environment.api_url;
  constructor(private _http:HttpClient) {  }

  PostSets(sets:any){
   return this._http.post(environment.api_url+'Admin/AddSet',sets);
  }
  GetAllSets(){
    return this._http.get(environment.api_url+'Admin/GetAllSet');
  }
  GetAllJobSets(setId:number){
    return this._http.get(environment.api_url+'Admin/GetAllSetJob/'+setId);
  }
}

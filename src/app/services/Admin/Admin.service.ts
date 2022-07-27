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
}

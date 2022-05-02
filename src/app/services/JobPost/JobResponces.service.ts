import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobResponcesService {
  baseURL=environment.api_url;
  constructor(private _http:HttpClient) {  }
  GetJobResponces(jobId:number,userId:number){
    return this._http.get(this.baseURL+'Message/'+jobId+'/'+userId);
  }
}

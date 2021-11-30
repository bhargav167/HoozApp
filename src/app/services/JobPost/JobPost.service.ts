import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { JobModel } from '../../Model/Job/JobModel';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {
  baseURL=environment.api_url;
  constructor(private _http:HttpClient) {  }
  AddJobPost(job:JobModel){
    return  this._http.post(this.baseURL + 'Job/AddJob',job);
    } 

    AddPostImages(jobId:number, file:any){
      return  this._http.post(this.baseURL + 'Job/AddJobImage/'+jobId,file);
    }
}

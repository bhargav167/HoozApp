import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { JobModel } from '../../Model/Job/JobModel';
import { Observable, Subject } from 'rxjs';
import { PaginatedResult } from '../../Model/Pagination';
import { JobResponces } from '../../Model/Job/JobResponces';
import { map } from 'rxjs/operators';
import { UserJobs } from '../../Model/Job/UserJobs';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {
  baseURL=environment.api_url;
  constructor(private _http:HttpClient) {

   }
lo(){
  return 
}
  AddJobPost(job:JobModel){
    return  this._http.post(this.baseURL + 'Job/AddJob',job);
    }

  UpdateJobPost(jobId: number, job: JobModel) {
    return this._http.post(this.baseURL + 'Job/UpdateJob/' + jobId, job);
  }

    AddPostImages(jobId:number, file:any){
      return  this._http.post(this.baseURL + 'Job/AddJobImage/'+jobId,file);
    }
    GetAllJob(){
      return this._http.get(this.baseURL+'Job/AllJob');
    }
    GetJobById(id:number){
      return this._http.get(this.baseURL+'Job/WebSingleJobByJobId/'+id);
    }

    GetResponceCount(jobId:number,senderId:number){
      return  this._http.get(this.baseURL + 'WebPost/ResponceCount/'+jobId + '/'+senderId);
    }

    GetAllWithAddedJob(userId:number, page?:number, itemsPerPage?:number,Jobstatus?:any): Observable<PaginatedResult<JobResponces>>{
      const paginatedResult: PaginatedResult<JobResponces> = new PaginatedResult<JobResponces>();
      let params = new HttpParams();
      if (page != null && itemsPerPage != null) {
        params = params.append('pageNumber', page);
        params = params.append('pageSize', itemsPerPage);
        params = params.append('JobStatus', Jobstatus);

      }
     //  params = params.append('searchTag', searchTerm);
      return this._http.get<any>(this.baseURL+'Job/GetAllWithAddedJob/'+userId,{ observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;

          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(<any>response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
    }

    GetPostJob(userId:number, page?:number, itemsPerPage?:number,Jobstatus?:any): Observable<PaginatedResult<JobResponces>>{
      const paginatedResult: PaginatedResult<JobResponces> = new PaginatedResult<JobResponces>();
      let params = new HttpParams();
      if (page != null && itemsPerPage != null) {
        params = params.append('pageNumber', page);
        params = params.append('pageSize', itemsPerPage);
        params = params.append('JobStatus', Jobstatus);
      }
     //  params = params.append('searchTag', searchTerm);
      return this._http.get<any>(this.baseURL+'Job/JobById/'+userId,{ observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;

          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(<any>response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
    }

    //Update Job Status
    UpdateJobStatus(jobId:number, JobStatus:string){
      return  this._http.post(this.baseURL + 'Job/UpdateJobStatus/'+jobId+'/'+JobStatus,{});
    }

    //Add Job By User
    AddJobToUser(userJobs:UserJobs){
    return  this._http.post(this.baseURL + 'User/AddUserJobs',userJobs);
  }
   //Check is job add to logged user
   IsAddedJob(userId:number,jobId:number){
    return  this._http.get(this.baseURL + 'User/IsAddedJob/'+userId+'/'+jobId);
  }
}

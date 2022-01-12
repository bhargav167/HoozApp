import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { JobModel } from '../../Model/Job/JobModel';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../../Model/Pagination';
import { JobResponces } from '../../Model/Job/JobResponces';
import { map } from 'rxjs/operators';

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
    GetAllJob(){
      return this._http.get(this.baseURL+'Job/AllJob');
    }
    GetJobById(id:number){ 
      return this._http.get(this.baseURL+'Job/WebSingleJobByJobId/'+id);
    } 
   
    GetAllWithAddedJob(page?, itemsPerPage?): Observable<PaginatedResult<JobResponces>>{
      const paginatedResult: PaginatedResult<JobResponces> = new PaginatedResult<JobResponces>();
      let params = new HttpParams();
      if (page != null && itemsPerPage != null) {
        params = params.append('pageNumber', page);
        params = params.append('pageSize', itemsPerPage);
        
      }
     //  params = params.append('searchTag', searchTerm);
      return this._http.get<JobResponces>(this.baseURL+'Job/GetAllWithAddedJob',{ observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
  
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      ); 
    }

    GetPostJob(userId:number, page?, itemsPerPage?): Observable<PaginatedResult<JobResponces>>{
      const paginatedResult: PaginatedResult<JobResponces> = new PaginatedResult<JobResponces>();
      let params = new HttpParams();
      if (page != null && itemsPerPage != null) {
        params = params.append('pageNumber', page);
        params = params.append('pageSize', itemsPerPage);
        
      }
     //  params = params.append('searchTag', searchTerm);
      return this._http.get<JobResponces>(this.baseURL+'Job/JobById/'+userId,{ observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
  
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      ); 
    }
}

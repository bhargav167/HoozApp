import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobParams } from '../../Model/JobParams';
import { PaginatedResult } from '../../Model/Pagination';
import { WallResponce } from '../../Model/Wall/WallResponce';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class WallService {
  userParams: JobParams;
  baseURL=environment.api_url;
  constructor(private _http:HttpClient) {  }

  GetWall(page?, itemsPerPage?,searchTerm?): Observable<PaginatedResult<WallResponce>>{
    const paginatedResult: PaginatedResult<WallResponce> = new PaginatedResult<WallResponce>();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
      
    }
     params = params.append('searchTag', searchTerm);
    return this._http.get<WallResponce>(this.baseURL+'Wall/WebGetJobsByMultiTags',{ observe: 'response', params })
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

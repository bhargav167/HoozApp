import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Reporting } from '../../Model/Report/Reporting';
@Injectable({
  providedIn: 'root'
})
export class ReportJobService {
  baseURL=environment.api_url;
  constructor(private _http:HttpClient) {  }

  ReportJob(reporting: Reporting) {
    return this._http.post(this.baseURL + 'Report/AddJobReport', reporting);
  } 
}

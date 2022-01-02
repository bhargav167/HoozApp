import { JobModel } from "./JobModel";

 

export interface JobResponces { 
    Success:boolean;
    Status:number;
    status_message:string;
    PageNumber:number;
    PageSize:number;
    TotalRecord:number;
    TotalPage:number;
    data:JobModel[];
}  
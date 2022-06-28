import { JobTags } from "../Job/JobTags";

 
export interface WallResponce { 
    Success:boolean;
    Status:number;
    status_message:string;
    PageNumber:number;
    PageSize:number;
    TotalRecord:number;
    TotalPage:number;
    data:JobTags[];
}  
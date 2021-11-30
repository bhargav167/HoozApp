import { JobTags } from "./JobTags";

export interface JobModel { 
    Id:number;
    UserId: number;
    Descriptions: string; 
    ImagesUrl:string;
    Latitude:string;
    Longitude:string;
    Address:string;
    Status:string;
    IsAnonymous:boolean;
    IsPublic:boolean;
    IsLocal:boolean;
    IsGlobal:boolean;
    CreatedBy:Date;
    JobStatus:string;
    Tags:JobTags[];
} 
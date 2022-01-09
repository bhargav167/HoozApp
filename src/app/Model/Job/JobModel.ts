import { SocialAuthentication } from "../User/SocialAuthentication";
import { JobTags } from "./JobTags";

export interface JobModel { 
    Id:number;
    UserId: number;
    Descriptions: string; 
    ImagesUrl:string;
    AnonmousUserPic:string;
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
    TimeAgo:string;
    Tags:JobTags[];
    User:SocialAuthentication;
} 
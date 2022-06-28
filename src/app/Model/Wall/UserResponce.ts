import { Tags } from "../User/Tags";


export interface UserResponce {
    Success:boolean;
    Status:number;
    status_message:string;
    PageNumber:number;
    PageSize:number;
    TotalRecord:number;
    TotalPage:number;
    data:Tags[];
}

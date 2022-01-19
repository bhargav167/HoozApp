import { Tags } from "./Tags";

export interface SocialAuthentication { 
  Id:number;
  UserName:string;
  Email:string;
  LoginProvider:string;
  ImageUrl:string;
  UserImage:string;
  CoverImageUrl:string;
  Name:string;
  MobileNumber:string;
  Password:string;
  WebSiteUrl:string;
  Latitude:string;
  Longitude:string;
  UserAddress:string;
  AboutUs:string;
  tags:Tags[];
  Status:number;
  Success:boolean;
  Status_Message:string;
  IsProfileCreated:boolean;
} 
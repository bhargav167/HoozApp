import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { fromEvent, of } from 'rxjs'; 
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PaginatedResult, Pagination } from '../../Model/Pagination';
import { TagMaster } from '../../Model/TagMaster';
import { SocialAuthentication } from '../../Model/User/SocialAuthentication'; 
import { WallResponce } from '../../Model/Wall/WallResponce';
import { ProfileService } from '../../services/Auth/Profile.service';
import { WallService } from '../../services/Wall/Wall.service';
 
@Component({
  selector: 'app-wallList',
  templateUrl: './wallList.component.html',
  styleUrls: ['./wallList.component.css']
})
export class WallListComponent implements OnInit { 
  @ViewChild('movieSearchInput', { static: true }) movieSearchInput: ElementRef;
 
  public flag: boolean = true; 
  userParams: string = '';
  pagination: Pagination;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  searchTerm: string;
  hidesearchlist:boolean=false;
  showClose:boolean=false;
  walldata: WallResponce;
  walldatas: WallResponce[];
  isLoading: boolean = true; 
  tag:TagMaster;
  searchval:string; 
user:SocialAuthentication;
//Scroll Variable
NotEmptPost:boolean=true;
notScrollY:boolean=true;
isLogedIn:boolean=false;
navbarUserPic:string;
 
  constructor(private _wallServices:WallService,private _profileServices:ProfileService, private _http:HttpClient) {  
    if(localStorage.getItem('user')){
      this.user= JSON.parse(localStorage.getItem('user'));
      this._profileServices.GetUserProfile(this.user.Id).subscribe((data:SocialAuthentication)=>{
        this.navbarUserPic=data.UserImage;
        console.log()
      },err=>{
        console.log("Something wen wrong"+err);
      })
      this.isLogedIn=true; 
    }else{
      this.isLogedIn=false; 
    }
  } 
  ngOnInit() {  
    this.fireSearchlist(); 
    this.LoadWallData(this.currentPage, this.itemsPerPage, this.userParams); 
  }

  //For Nav
  LogOut(){
    localStorage.clear();
    location.href='/';
  }

  //Search wall
  Search(searchTerm){ 
    this.currentPage=1;
    this.hidesearchlist=false; 
    this.userParams=(document.getElementById("searchTag") as HTMLInputElement).value;
    this.LoadWallData(this.currentPage, this.itemsPerPage, searchTerm); 
    this.searchval=searchTerm; 
  }
  ClearSearch(){ 
    this.showClose=false;
    this.hidesearchlist=false;
    this.searchval='';
    this.userParams='';
    this.NotEmptPost=true;
    this.LoadWallData(this.currentPage, this.itemsPerPage, this.userParams); 
  }
  fireSearchlist(){
    fromEvent(this.movieSearchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > -1)

      // Time in milliseconds between key events
      , debounceTime(0)

      // If previous query is diffent from current   
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => {
      //Search api call
      this.searchGetCall(text).subscribe((res:any) => { 
        if(res.data.length==0){
          this.hidesearchlist=false; 
          return;
        }
       this.tag=res;  
       this.hidesearchlist=true;
       this.showClose=true;
      }, (err) => { 
        console.log('error', err);
      });
    }); 
  } 

  searchGetCall(term: string) {
    if (term === '') {
      return of([]);
    }
    return this._http.get(environment.api_url + 'Tag/TagSuggestion/' + term);
  }
  //End Search

  
  
  LoadWallData(currentPage:number, itemsPerPage:number,userParams) {
 this.isLoading=true;
    this._wallServices.GetWall(currentPage, itemsPerPage, userParams).subscribe((res:any) => { 
      this.walldata = res.result; 
      this.walldatas=res.result;
      this.pagination = res.pagination;  
    this.isLoading=false; 
    })
  } 
  LoadNextPost(){ 
    this.currentPage=this.currentPage+1;
     this._wallServices.GetWall(this.currentPage, this.itemsPerPage, this.userParams).subscribe((res:any) => { 
       const newData=res.result;
       this.isLoading=false;
       if(newData.length===0){
         this.NotEmptPost=false;
       }
      
      this.walldatas=this.walldatas.concat(newData);
      this.notScrollY=true;
      this.pagination = res.pagination;  
    })
  }
  onScroll(){
    if(this.notScrollY && this.NotEmptPost){
      this.isLoading=true;
      this.notScrollY=false;
      this.LoadNextPost();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from '../../Model/Pagination';
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { UserResponce } from '../../Model/Wall/UserResponce';
import { WallService } from '../../services/Wall/Wall.service';

@Component({
  selector: 'app-userList',
  templateUrl: './userList.component.html',
  styleUrls: ['./userList.component.scss']
})
export class UserListComponent implements OnInit {
  user:SocialAuthentication;
  userId:number=0;
  userParams: string = '';
  pagination: Pagination;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  walldata: UserResponce;
  walldatas: UserResponce[];
  isLoading: boolean = true;
  NotEmptPost: boolean = true;
  noResultText: string = "Explore more with different keyword";
  constructor(private _wallServices:WallService,private activatedRoute: ActivatedRoute) {
    if(localStorage.getItem('user')){
      this.user= JSON.parse(localStorage.getItem('user'));
      this.userId=this.user.Id;
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const paramVal = params['searchTag'];
       if (paramVal==undefined) {

        this.loadUserList(this.currentPage, this.itemsPerPage, this.userParams,this.userId);
       }else{
         this.userParams=paramVal;
         this.loadUserList(this.currentPage, this.itemsPerPage, this.userParams,this.userId);
       }
    });

  }
  loadUserList(currentPage:number, itemsPerPage:number,userParams,userId){
    this.isLoading=true;
    this._wallServices.GetUserWall(currentPage, itemsPerPage, userParams, userId).subscribe((res: any) => {
      this.walldata = res.result;
      this.walldatas = res.result;
      this.pagination = res.pagination;
      this.isLoading = false;
      this.NotEmptPost = true;
    },
    (err) => {
      this.isLoading = false;
      this.walldatas = [];
      this.NotEmptPost = false;
      this.noResultText = `Couldn't find any Post with tag "${userParams}" try a different keyword.`;
    }
    )
  }
}

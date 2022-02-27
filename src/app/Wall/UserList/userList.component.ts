import { Component, OnInit } from '@angular/core';
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
  constructor(private _wallServices:WallService) {
    if(localStorage.getItem('user')){
      this.user= JSON.parse(localStorage.getItem('user'));
      this.userId=this.user.Id; 
    } 
  }

  ngOnInit() {
    this.loadUserList(this.currentPage, this.itemsPerPage, this.userParams,this.userId); 
  }
  loadUserList(currentPage:number, itemsPerPage:number,userParams,userId){
    this.isLoading=true;
    this._wallServices.GetUserWall(currentPage, itemsPerPage, userParams, userId).subscribe((res: any) => {
      this.walldata = res.result;
      this.walldatas = res.result;
      this.pagination = res.pagination;
      this.isLoading = false;
      console.log(this.walldatas);
    }) 
  }
}

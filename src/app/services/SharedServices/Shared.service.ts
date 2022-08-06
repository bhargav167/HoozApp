import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public IslogingPage:boolean=false;
  public isonChatBox$=new Subject<boolean>();
constructor(private toast: HotToastService,) { }

  checkInterNetConnection():any {
    if (!navigator.onLine)
      return this.toast.info('Please check your internet connection', {
        position: 'top-center',
      });
  }
  LoggedUserData(){
    if(localStorage.getItem('user')){
      let user= JSON.parse(localStorage.getItem('user')!);
      this.IslogingPage=false;
    }else{
      window.location.href='/login';
    }
  }
  IsUserIsOnLogInPage(){
    this.IslogingPage=true;
  }
}

import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
constructor(private toast: HotToastService,) { }

  checkInterNetConnection() {
    if (!navigator.onLine)
      return this.toast.info('Please check your internet connection', {
        position: 'top-center',
      });
  }
  LoggedUserData(){
    if(localStorage.getItem('user')){
      let user= JSON.parse(localStorage.getItem('user')); 
    }else{
      window.location.href='/login';
    } 
  }
}

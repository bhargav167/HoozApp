import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';  
@Injectable({
    providedIn: 'root'
})
export class LoginGaurd implements CanActivate {
    constructor(private _router: Router) {
    }
    canActivate(
        next:  ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (localStorage.getItem('user')) {
            return true;
        }
        else {
            window.location.href='/';
            return false;
        }
    }
}

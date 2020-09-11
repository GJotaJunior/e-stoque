import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    constructor(public authService: AuthService,
        public router: Router) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.isLoggedIn) {
            this.router.navigate(['login'])
        }

        return this.authService.isLoggedIn;
    }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthService } from 'src/app/modules/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  @ViewChild('drawer', { static: false }) drawer: MatDrawer;

  isLoggedIn: boolean;

  constructor(private _authService: AuthService) {
    this._authService.user.subscribe(
      user => {
        this.isLoggedIn = (user) ? true : false
      }
    )
  }

  ngOnInit(): void {
  }

  logout() {
    this._authService.singOut();
    this.closeDrawer();
  }

  closeDrawer() {
    this.drawer.close();
  }

}

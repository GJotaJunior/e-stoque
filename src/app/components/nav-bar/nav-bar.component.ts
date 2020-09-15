import { IUser } from './../../shared/interfaces/iuser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from 'src/app/modules/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  @ViewChild('drawer', { static: false }) drawer: MatDrawer;

  isLoggedIn: boolean;
  isAdmin: boolean;
  user: firebase.User;

  constructor(private _authService: AuthService,
    private _firestore: AngularFirestore) {
    this._authService.user.subscribe(
      user => {
        if (user) {
          this.isLoggedIn = true;
          this._firestore.collection('users').doc(user.uid).valueChanges().subscribe(
            doc => this.isAdmin = doc['isAdmin']
          )
        }
      }
    );
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

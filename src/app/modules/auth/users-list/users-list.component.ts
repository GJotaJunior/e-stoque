import { IUser } from './../../../shared/interfaces/iuser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'email',
    'isActive',
    'changeIsActive',
    'isAdmin',
    'changeIsAdmin'
  ]

  data = [];
  uids = [];
  dataSource: MatTableDataSource<IUser> = new MatTableDataSource([]);

  @ViewChild(MatSort) sort: MatSort;

  private _db: AngularFirestoreCollection<unknown>;

  constructor(private _firestore: AngularFirestore,
    private _router: Router,
    private _auth: AngularFireAuth) {

    setTimeout(() => { }, 3000)
    this._db = this._firestore.collection('users', ref => ref.orderBy('name'));
  }

  ngOnInit(): void {
    this.chargeUsers();
  }

  chargeUsers() {
    this._auth.user.subscribe(
      user => {
        this._db.doc(user.uid).valueChanges().subscribe(
          doc => {
            if (!doc['isAdmin']) this._router.navigate(['']);
          }
        )
      }
    )

    this._db.valueChanges({ idField: 'uid' }).subscribe(
      (data) => {
        data.forEach(user => {
          if (!this.uids.includes(user['uid'])) {
            this.data.push(user);
            this.uids.push(user['uid'])
          }
        });
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.sort = this.sort;
      }
    );
  }

  changeIsActive(user: IUser) {
    let inactivatedDate = (user.isActive) ? new Date() : null
    let isActive = !user.isActive;
    let isAdmin = false

    this._db.doc(user.uid).update({ isActive, inactivatedDate, isAdmin }).then(
      () => {
        user.isActive = isActive;
        user.inactivatedDate = inactivatedDate;
        user.isAdmin = false;
      }
    );
  }

  changeIsAdmin(user: IUser) {
    let isAdmin = (!user.isAdmin)
    let isActive = true;

    this._db.doc(user.uid).update({ isAdmin, isActive }).then(
      () => {
        user.isAdmin = !user.isAdmin;
        user.isActive = isActive;
      }
    );
  }

}
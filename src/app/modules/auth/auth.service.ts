import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FirebaseFirestore } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: firebase.User;

  constructor(private _fireAuth: AngularFireAuth,
    private _snackBar: MatSnackBar,
    private _router: Router) {
    this._user = JSON.parse(sessionStorage.getItem('user'));
  }

  signIn(email: string, password: string) {
    return this._fireAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        this._user = userCredential.user;
        sessionStorage.setItem('user', JSON.stringify(this._user));
        console.log(`Success SignIn! ${userCredential.user.displayName}`)
        this._router.navigate(['/']);
      })
      .catch(err => this._snackBar.open(err.message, 'X', { duration: 5000 }));
  }

  async signUp(email: string, password: string, name: string): Promise<string> {
    let uid;

    await this._fireAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        uid = userCredential.user.uid;
        userCredential.user.updateProfile({
          displayName: name,
        })
        console.log(`Success SignUp!`);
        this._snackBar.open('Cadastro realizado com sucesso!', 'X', { duration: 3000 })
      })
      .catch(err => this._snackBar.open(err.message, 'X', { duration: 5000 }));

    return uid;
  }

  singOut() {
    this._user = null;
    sessionStorage.removeItem('user');
    return this._fireAuth.auth
      .signOut()
      .then(() => {
        console.log(`Success SignOut!`);
        this._router.navigate(['login']);
      })
      .catch(err => this._snackBar.open(err.message, 'X', { duration: 5000 }));
  }

  get isLoggedIn(): boolean {
    return (this._user != null);
  }

  get user(): firebase.User {
    return this._user;
  }

}

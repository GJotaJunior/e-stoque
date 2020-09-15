import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: Observable<firebase.User>;
  private _userDetails: firebase.User;

  constructor(private _fireAuth: AngularFireAuth,
    private _firestore: AngularFirestore,
    private _snackBar: MatSnackBar,
    private _router: Router) {

    this._user = _fireAuth.authState;

    _fireAuth.authState.subscribe(
      user => this._userDetails = user
    );
  }

  async signIn(email: string, password: string) {
    let uid;

    await this._fireAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(
        (userCredential) => {
          console.log(`Success SignIn! ${userCredential.user.displayName}`)
          uid = userCredential.user.uid;
          this._router.navigate(['/']);
        })
      .catch(err => this._snackBar.open(err.message, 'X', { duration: 5000 }));

    setTimeout(() => {
      this._firestore.collection('users').doc(uid).valueChanges().subscribe(
        (userDoc) => {
          if (!userDoc['isActive'] && userDoc != undefined) {
            this.singOut();
            this._snackBar.open('A conta foi desativado por um administrador', 'X', { duration: 3000 })
          }
        }
      )
    }, 1000)
  }

  async signUp(email: string, password: string, name: string): Promise<string> {
    let uid;

    await this._fireAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(
        (userCredential) => {
          uid = userCredential.user.uid;
          userCredential.user.updateProfile({
            displayName: name,
          })
          console.log(`Success SignUp!`);
          this._snackBar.open('Cadastro realizado com sucesso', 'X', { duration: 3000 })
        })
      .catch(err => this._snackBar.open(err.message, 'X', { duration: 5000 }));

    return uid;
  }

  async singOut() {
    this._user = null;
    return this._fireAuth.auth
      .signOut()
      .then(
        () => {
          console.log(`Success SignOut!`);
          this._router.navigate(['login']);
        })
      .catch(err => this._snackBar.open(err.message, 'X', { duration: 5000 }));
  }

  async changePassword(newPassword: string) {
    return this._fireAuth.auth.currentUser.updatePassword(newPassword)
      .then(
        () => {
          this._snackBar.open('Senha alterada com sucesso', '', { duration: 4000 });
          this._router.navigate(['login'])
        }
      )
      .catch(err => this._snackBar.open(err.message, 'X', { duration: 5000 }));
  }

  async sendPasswordResetEmail(email: string) {
    return this._fireAuth.auth.sendPasswordResetEmail(email)
      .then(
        () => {
          this._snackBar.open('E-mail enviado com sucesso, entre no seu e-mail para recuperar a senha', '', { duration: 4000 });
          this._router.navigate(['login'])
        }
      )
      .catch(err => this._snackBar.open(err.message, 'X', { duration: 5000 }));
  }

  async resetPassword(code: string, newPassword: string) {
    return this._fireAuth.auth.confirmPasswordReset(code, newPassword)
      .then(
        () => {
          this._snackBar.open('Senha alterada com sucesso', '', { duration: 4000 });
          this._router.navigate(['login']);
        }
      )
      .catch(err => this._snackBar.open(err.message, 'X', { duration: 5000 }));
  }

  get user(): Observable<firebase.User> {
    return this._user;
  }

  get userDetails(): firebase.User {
    return this._userDetails;
  }
}

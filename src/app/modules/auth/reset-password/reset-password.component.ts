import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  oobCode: string;
  mode: string;

  passwordForm: FormGroup;

  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _route: ActivatedRoute) {
    this.oobCode = this._route.snapshot.queryParams['oobCode'];
    this.mode = this._route.snapshot.queryParams['mode'];
  }

  ngOnInit(): void {
    if (this.mode != 'resetPassword' && this.mode != 'change')
      this._router.navigate(['']);

    this.passwordForm = this.formBuilder.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12)
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12)
        ]
      ]
    });
  }

  changePassword() {
    let newPassword: string = this.passwordForm.controls['password'].value;
    let confirmPassword: string = this.passwordForm.controls['confirmPassword'].value;

    if (newPassword != confirmPassword) {
      this._snackBar.open('As senhas precisam ser iguais', 'X', { duration: 4000 })
    } else if (this.mode == 'resetPassword') {
      this._authService.resetPassword(this.oobCode, newPassword);
    } else if (this.mode == 'change') {
      this._authService.changePassword(newPassword);
    }
  }

  getPasswordFieldError(): string {
    let password = this.passwordForm.controls['password'];

    if (password.hasError('required'))
      return 'O campo é de preenchimento obrigatório';

    return (password.hasError('minlength')
      ? 'O campo deve ser preenchido com no mínimo 6 caracteres'
      : 'O campo deve ser preenchido com no máximo 12 caracteres');
  }

  getConfirmPasswordFieldError(): string {
    let password = this.passwordForm.controls['confirmPassword'];

    if (password.hasError('required'))
      return 'O campo é de preenchimento obrigatório';

    return (password.hasError('minlength')
      ? 'O campo deve ser preenchido com no mínimo 6 caracteres'
      : 'O campo deve ser preenchido com no máximo 12 caracteres');
  }

}

import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  hidePassword: boolean = true;

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private _router: Router) {
    if (this._authService.user) this._router.navigate(['/']);
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.email,
          Validators.required
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12)
        ]
      ],
    })
  }

  login(): void {
    this._authService.signIn(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value);
  }

  getEmailFieldError(): string {
    let email = this.loginForm.controls['email'];
    return (email.hasError('email'))
      ? 'O campo deve ser preenchido com um email válido'
      : 'O campo é de preenchimento obrigatório';
  }

  getPasswordFieldError(): string {
    let password = this.loginForm.controls['password'];

    if (password.hasError('required'))
      return 'O campo é de preenchimento obrigatório';

    return (password.hasError('minlength')
      ? 'O campo deve ser preenchido com no mínimo 6 caracteres'
      : 'O campo deve ser preenchido com no máximo 12 caracteres');
  }

}

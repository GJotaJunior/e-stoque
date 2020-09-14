import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;

  constructor(private _authService: AuthService,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.resetPasswordForm = this._formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]
    });
  }

  sendResetEmail() {
    let email: string = this.resetPasswordForm.controls['email'].value;

    this._authService.sendPasswordResetEmail(email);
  }

  getEmailFieldError(): string {
    let email = this.resetPasswordForm.controls['email'];
    return (email.hasError('email'))
      ? 'O campo deve ser preenchido com um email válido'
      : 'O campo é de preenchimento obrigatório';
  }
}

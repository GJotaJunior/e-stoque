import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(private _authService: AuthService,
    private _firestore: AngularFirestore,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.email,
          Validators.required,
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
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12)
        ]
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.pattern("^[A-zÀ-ÿ']+\\s([A-zÀ-ÿ']\\s?)*[A-zÀ-ÿ']+$")
        ]
      ],
      isAdmin: [
        false
      ]
    })
  }

  async register() {
    let name: string = this.registerForm.controls['name'].value;
    let email: string = this.registerForm.controls['email'].value;
    let password: string = this.registerForm.controls['password'].value;
    let confirmPassword: string = this.registerForm.controls['confirmPassword'].value;
    let isAdmin: boolean = this.registerForm.controls['isAdmin'].value;
    let registerBy: string = this._authService.userDetails.uid;

    if (password != confirmPassword) {
      this._snackBar.open('As senhas precisam ser iguais', 'X', { duration: 4000 })
    }
    else {
      await this._authService.signUp(email, password, name).then(
        (uid) => this._firestore.collection('users').doc(uid).set({
          name, email, isAdmin, registerBy, isActive: true
        })
      ).then(
        () => this.registerForm.reset()
      );
    }
  }

  getEmailFieldError(): string {
    let email = this.registerForm.controls['email'];
    return (email.hasError('email'))
      ? 'O campo deve ser preenchido com um email válido'
      : 'O campo é de preenchimento obrigatório';
  }

  getPasswordFieldError(): string {
    let password = this.registerForm.controls['password'];

    if (password.hasError('required'))
      return 'O campo é de preenchimento obrigatório';

    return (password.hasError('minlength')
      ? 'O campo deve ser preenchido com no mínimo 6 caracteres'
      : 'O campo deve ser preenchido com no máximo 12 caracteres');
  }

  getConfirmPasswordFieldError(): string {
    let password = this.registerForm.controls['confirmPassword'];

    if (password.hasError('required'))
      return 'O campo é de preenchimento obrigatório';

    return (password.hasError('minlength')
      ? 'O campo deve ser preenchido com no mínimo 6 caracteres'
      : 'O campo deve ser preenchido com no máximo 12 caracteres');
  }

  getNameFieldError(): string {
    let name = this.registerForm.controls['name'];

    if(name.hasError('pattern'))
      return 'Por favor, insira seu nome completo'

    return (name.hasError('required'))
      ? 'O campo é de preenchimento obrigatório'
      : 'O campo deve ser preenchido com no mínimo 5 caracteres'
  }

  getIsAdminFieldError(): string {
    return 'Necessário selecionar uma opção'
  }

}

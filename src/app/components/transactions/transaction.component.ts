import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private _authService: AuthService,
    private _firestore: AngularFirestore,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      amount: [
        '',
        [
          Validators.required,
          Validators.pattern['\d+']
        ]
      ],
      price: [
        '',
        [
          Validators.required,
          Validators.pattern['R\$ ?\d{1,3},\d{2}']
        ]
      ],
      typeEnum: [
        '',
        [
          Validators.required
        ]
      ],
      dateHour: [
        '',
        [
          Validators.required
        ]
      ]
    })
  }


  async registerTransaction() {
    let amount: boolean = this.registerForm.controls['amount'].value;
    let price: string = this.registerForm.controls['price'].value;
    let typeEnum: string = this.registerForm.controls['typeEnum'].value;
    let dateHour: string = this.registerForm.controls['dateHour'].value;
    let salesman: string = this._authService.userDetails.uid;

    this._firestore.collection('products').add({
      transaction: {
        amount, price, typeEnum, dateHour, salesman
      }
    })
    .then(
      () => this.registerForm.reset()
    )
  }

  getAmountFieldError(): string {
    let amount = this.registerForm.controls['amount'];

    return (amount.hasError('pattern'))
      ? 'O campo deve ser preenchido somente com números'
      : 'O campo é de preenchimento obrigatório';
  }

  getPriceFieldError(): string {
    let price = this.registerForm.controls['price'];

    return (price.hasError('pattern')
      ? 'O campo deve ser preenchido com um valor válido'
      : 'O campo é de preenchimento obrigatório');
  }

  getTypeEnumFieldError(): string {
    let typeEnum = this.registerForm.controls['typeEnum'];

    if(typeEnum.hasError('required')) 
      return 'O campo é de preenchimento obrigatório'
  }

  getDateHourFieldError(): string {
    let dateHour = this.registerForm.controls['dateHour'];

    if (dateHour.hasError('required'))
      return 'O campo é de preenchimento obrigatório'
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { firestore } from 'firebase';

@Component({
  selector: 'app-transaction-in',
  templateUrl: './transaction-in.component.html',
  styleUrls: ['./transaction-in.component.css']
})
export class TransactionInComponent implements OnInit {

  transactionForm: FormGroup;
  date: Date;

  
  products = []
  _db: AngularFirestoreCollection<unknown>;

  constructor(private _firestore: AngularFirestore,
    private _formBuilder: FormBuilder,) {

      this._db = this._firestore.collection('products', ref => ref.orderBy('name'));

      this._db.valueChanges({ idField: 'uid' }).subscribe(
        (data) => {
          data.forEach(product => {
              this.products.push({
                productId: product['uid'],
                name: product['name']
              });
          });
        }
      );
  }

  ngOnInit(): void {
    this.buildForm();
  }

  async registerTransaction() {
    let productId: string = this.transactionForm.controls['productId'].value;
    let amount: string = this.transactionForm.controls['amount'].value;
    let price: number = this.transactionForm.controls['price'].value;
    let typeEnum: string = 'entrada';
    let dateHour: firestore.Timestamp = firestore.Timestamp.now();

    this._firestore.collection(`products/${productId}/moves`).add({
      amount, price, typeEnum, dateHour
    }
    )
      .then(
        () => {
          this.transactionForm.reset();
          this.transactionForm.updateValueAndValidity({
            onlySelf: true
            });
        }
      )
  }

  buildForm(): void {
    this.transactionForm = this._formBuilder.group({
      productId: [
         '',
         [
           Validators.required
         ]
       ],
      amount: [
        '',
        [
          Validators.required
        ]
      ],
      price: [
        '',
        [
          Validators.required
        ]
      ]
    })
  }

  getProductIdFieldError(): string {
    let productId = this.transactionForm.controls['productId'];

    if (productId.hasError('required'))
      return 'O campo é de preenchimento obrigatório'
  }

  getAmountFieldError(): string {
    let amount = this.transactionForm.controls['amount'];

    if (amount.hasError('required'))
      return 'O campo é de preenchimento obrigatório'
  }

  getPriceFieldError(): string {
    let price = this.transactionForm.controls['price'];

    if (price.hasError('required'))
      return 'O campo é de preenchimento obrigatório'
  }
}

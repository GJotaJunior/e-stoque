import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../modules/auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { firestore } from 'firebase'
@Component({
  selector: 'app-transaction-out',
  templateUrl: './transaction-out.component.html',
  styleUrls: ['./transaction-out.component.css']
})
export class TransactionOutComponent implements OnInit {

  transactionForm: FormGroup;

  products = []
  _db: AngularFirestoreCollection<unknown>;

  constructor(private _authService: AuthService,
    private _firestore: AngularFirestore,
    private _formBuilder: FormBuilder) {
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

    console.log(this.products)
  }

  ngOnInit(): void {
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
      typeEnum: [
        '',
        [
          Validators.required
        ]
      ]
    })
  }

  async registerTransaction() {
    let productId: string = this.transactionForm.controls['productId'].value;
    let amount: string = this.transactionForm.controls['amount'].value;
    let typeEnum: string = this.transactionForm.controls['typeEnum'].value;
    let dateHour: firestore.Timestamp = firestore.Timestamp.now();
    let seller: firestore.DocumentReference = this._firestore.collection('users').doc(this._authService.userDetails.uid).ref;

    this._firestore.collection(`products/${productId}/moves`).add({
      amount, typeEnum, dateHour, seller
    }
    )
      .then(
        () => {
          this.transactionForm.reset();
        }
      )
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
}
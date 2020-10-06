import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../modules/auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { IProduct } from '../../shared/interfaces/iproduct';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-transaction-out',
  templateUrl: './transaction-out.component.html',
  styleUrls: ['./transaction-out.component.css']
})
export class TransactionOutComponent implements OnInit {

  transactionForm: FormGroup;

  products:IProduct[] = [];
  uids: string[] = [];
  _db: AngularFirestoreCollection<unknown>;
  filteredOptions: Observable<IProduct[]>;

  constructor(private _authService: AuthService,
    private _firestore: AngularFirestore,
    private _formBuilder: FormBuilder) {
    this._db = this._firestore.collection('products', ref => ref.orderBy('name'));

    this._db.valueChanges({ idField: 'uid' }).subscribe(
      (data) => {
        data.forEach(product => {
          if(!this.uids.includes(product['uid'])){
            this.products.push({
              uid: product['uid'],
              name: product['name'],
              priceBar: product['priceBar'],
              priceDelivery: product['priceDelivery']
            });
            this.uids.push(product['uid']);
          }
        });
      }
    );
  }

  ngOnInit(): void {
    this.transactionForm = this._formBuilder.group({
      productName: [
        '',
        [
          Validators.required
        ]
      ],
      amount: [
        '',
        [
          Validators.required,
          Validators.pattern('^\\d{1,}$')
        ]
      ],
      typeEnum: [
        '',
        [
          Validators.required
        ]
      ]
    });

    this.filteredOptions = this.transactionForm.controls['productName'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.products.slice())
      );
  }

  async registerTransaction() {
    debugger
    let productId: string = this.checkProduct(this.transactionForm.controls['productName'].value);
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

  getProductNameFieldError(): string {
    let productName = this.transactionForm.controls['productName'];

    if (productName.hasError('required'))
      return 'O campo é de preenchimento obrigatório'
  }

  getAmountFieldError(): string {
    let amount = this.transactionForm.controls['amount'];

    return (amount.hasError('pattern'))
      ? 'O campo deve ser preenchido com um valor inteiro'
      : 'O campo é de preenchimento obrigatório';
  }

  checkProduct(name: string): string {
    for (let i = 0; i < this.products.length; i++) {
      if(name == this.products[i].name)
        return this.products[i].uid;
    }
  }

  displayFn(product: IProduct): string {
    return product && product.name ? product.name : '';
  }

  private _filter(name: string): IProduct[] {
    const filterValue = name.toLowerCase();

    return this.products.filter(product => product.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../modules/auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { IProduct } from '../../shared/interfaces/iproduct';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transaction-in',
  templateUrl: './transaction-in.component.html',
  styleUrls: ['./transaction-in.component.css']
})
export class TransactionInComponent implements OnInit {

  transactionForm: FormGroup;
  date: Date;
  selectedProduct: string = '';

  minAmountProduct: number = 1;
  products: IProduct[] = [];
  uids: string[] = [];
  _db: AngularFirestoreCollection<unknown>;
  filteredOptions: Observable<IProduct[]>;

  constructor(private _authService: AuthService,
    private _firestore: AngularFirestore,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) {

    this._db = this._firestore.collection('products', ref => ref.orderBy('name'));

    this._db.valueChanges({ idField: 'uid' }).subscribe(
      (data) => {
        data.forEach(product => {
          if (!this.uids.includes(product['uid'])) {
            this.products.push({
              uid: product['uid'],
              name: product['name'],
              priceBar: product['priceBar'],
              priceDelivery: product['priceDelivery'],
              amountStock: product['amountStock']
            });
            this.uids.push(product['uid']);
          }
        });
      }
    );
  }

  ngOnInit(): void {
    this.buildForm();

    this.filteredOptions = this.transactionForm.controls['productName'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.products.slice())
      );
  }

  async registerTransaction() {
    let product = this.checkProduct(this.transactionForm.controls['productName'].value);
    let productId: string = product.uid;
    let amount: number = this.transactionForm.controls['amount'].value;
    let price: number = Number.parseFloat((this.transactionForm.controls['price'].value).replace(',', '.'));
    let typeEnum: string = 'entrada';
    let dateHour: firestore.Timestamp = firestore.Timestamp.now();
    let purchaser: firestore.DocumentReference = this._firestore.collection('users').doc(this._authService.userDetails.uid).ref;

    this._firestore.collection('products').doc(productId).update({
      amountStock: product.amountStock + amount
    });

    this._firestore.collection(`products/${productId}/moves`).add({
      amount, price, typeEnum, dateHour, purchaser
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

    this._snackBar.open('Cadastro de compra realizado com sucesso!', 'X', { duration: 4000 });
  }

  buildForm(): void {
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
          Validators.pattern('^\\d{1,}$'),
          Validators.min(1)
        ]
      ],
      price: [
        '',
        [
          Validators.required,
          Validators.pattern('^(\\d{1,}(,|.)\\d{2})$')
        ]
      ]
    })
  }

  getProductNameFieldError(): string {
    let productName = this.transactionForm.controls['productName'];

    if (productName.hasError('required'))
      return 'O campo é de preenchimento obrigatório'
  }

  getAmountFieldError(): string {
    let amount = this.transactionForm.controls['amount'];

    if (amount.hasError('min'))
      return 'A quantidade deve ser no mínimo 1'

    if (amount.hasError('pattern'))
      return 'O campo deve ser preenchido com um valor inteiro'

    if (amount.hasError('required')) {
      amount.setValue('')
      return 'O campo é de preenchimento obrigatório'
    }
  }

  getPriceFieldError(): string {
    let price = this.transactionForm.controls['price'];

    return (price.hasError('pattern'))
      ? 'O campo deve ser preenchido com um valor válido. Ex.: 9,99'
      : 'O campo é de preenchimento obrigatório';
  }

  // Returns the corresponding product to the selected name

  checkProduct(name: string): IProduct {
    for (let i = 0; i < this.products.length; i++) {
      if (name == this.products[i].name)
        return this.products[i];
    }
  }

  // Checks if the price that will be use in cart is of the Bar or Delivery

  checkPrice(event: any) {
    let price: string = event.target.value;

    if (event.keyCode === 46 && price.split('.').length === 2 ||
      event.keyCode === 44 && price.split(',').length === 2)
      return false
    else if (event.keyCode == 46 && price.split(',').length === 2 ||
      event.keyCode == 44 && price.split('.').length === 2)
      return false
  }

  // Forces user to select a product

  productClick(event: any) {
    this.selectedProduct = event.option.value;
  }

  checkSelectedProduct() {
    if (!this.selectedProduct || this.selectedProduct !== this.transactionForm.controls['productName'].value) {
      this.transactionForm.controls['productName'].setValue('');
      this.selectedProduct = '';
    }
  }

  // Filter the options to auto-complete

  private _filter(name: string): IProduct[] {
    const filterValue = name.toLowerCase();

    return this.products.filter(product => product.name.toLowerCase().includes(filterValue));
  }

  // Converts the price into float if user has placed an integer

  convertPrice() {
    let priceVerify: boolean = (this.transactionForm.controls['price'].value).replace(',', '.').includes('.');;

    if (!priceVerify && this.transactionForm.controls['price'].value)
      this.transactionForm.controls['price'].setValue(this.transactionForm.controls['price'].value + ',00');
  }
}

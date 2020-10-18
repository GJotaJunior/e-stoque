import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../modules/auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort'
import { firestore } from 'firebase';
import { IProduct } from '../../shared/interfaces/iproduct';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transaction-out',
  templateUrl: './transaction-out.component.html',
  styleUrls: ['./transaction-out.component.css']
})
export class TransactionOutComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'amount',
    'typeEnum',
    'valueUnit'
  ]

  data = [];
  cart: MatTableDataSource<IProduct> = new MatTableDataSource([]);

  transactionForm: FormGroup;
  selectedProduct: string = '';

  valueProducts: number = 0;
  products: IProduct[] = [];
  _db: AngularFirestoreCollection<unknown>;
  filteredOptions: Observable<IProduct[]>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _authService: AuthService,
    private _firestore: AngularFirestore,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) {
    this._db = this._firestore.collection('products', ref => ref.orderBy('name'));

    this._db.valueChanges({ idField: 'uid', amountStockField: 'amountStock' }).subscribe(
      (data) => {
        this.products = [];
        data.forEach(product => {
          this.products.push({
            uid: product['uid'],
            name: product['name'],
            priceBar: product['priceBar'],
            priceDelivery: product['priceDelivery'],
            amountStock: product['amountStock']
          });
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

  async registerTransaction(productCart: any) {
    let product: IProduct = this.checkProduct(productCart.productName);
    let productId: string = product.uid;
    let amount: number = productCart.amount;
    let typeEnum: string = productCart.typeEnum;
    let dateHour: firestore.Timestamp = firestore.Timestamp.now();
    let seller: firestore.DocumentReference = this._firestore.collection('users').doc(this._authService.userDetails.uid).ref;

    this._firestore.collection('products').doc(productId).update({
      amountStock: product.amountStock - amount
    });

    this._firestore.collection(`products/${productId}/moves`).add({
      amount, typeEnum, dateHour, seller
    }
    )
      .then(
        () => {
          this.transactionForm.reset();
        }
      )

    this._snackBar.open('Cadastro de venda realizado com sucesso!', 'X', { duration: 4000 });
  }

  // Adds cart products to database

  cartRegister() {
    this.data.forEach(product => this.registerTransaction(product));

    this.data = [];
    this.cart = new MatTableDataSource(this.data);
    this.valueProducts = 0;
  }

  getProductNameFieldError(): string {
    let productName = this.transactionForm.controls['productName'];

    if (productName.hasError('required'))
      return 'O campo é de preenchimento obrigatório'
  }

  getAmountFieldError(): string {
    let product = this.checkProduct(this.transactionForm.controls['productName'].value);
    let amount = this.transactionForm.controls['amount'];

    if (product)
      amount.setValidators([Validators.required, Validators.pattern('^\\d{1,}$'),
      Validators.max(product.amountStock), Validators.min(1)]);

    amount.updateValueAndValidity();

    if (amount.hasError('max'))
      return 'Desculpe, mas não tem essa quantidade em estoque'

    if (amount.hasError('min'))
      return 'A quantidade deve ser no mínimo 1'

    if (amount.hasError('pattern'))
      return 'O campo deve ser preenchido com um valor inteiro'

    if (amount.hasError('required')) {
      amount.setValue('')
      return 'O campo é de preenchimento obrigatório'
    }
  }

  // Returns the corresponding product to the selected name

  checkProduct(name: string): IProduct {
    for (let i = 0; i < this.products.length; i++) {
      if (name == this.products[i].name)
        return this.products[i];
    }
  }

  // Checks if the price that will be use in cart is of the Bar or Delivery

  checkPrice(name: string, typeEnum: string): number {
    for (let i = 0; i < this.products.length; i++) {
      if (name == this.products[i].name && typeEnum == 'saidaBalcao')
        return this.products[i].priceBar;
      else if (name == this.products[i].name && typeEnum == 'saidaDelivery')
        return this.products[i].priceDelivery;
    }
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

  // Add a product into cart

  addInCart() {
    let productName: string = this.transactionForm.controls['productName'].value;
    let amount: number = this.transactionForm.controls['amount'].value;
    let typeEnum: string = this.transactionForm.controls['typeEnum'].value;
    let priceUnit: number = this.checkPrice(productName, typeEnum);

    this.data.push({
      productName,
      amount,
      typeEnum,
      priceUnit
    });
    this.cart = new MatTableDataSource(this.data);
    this.cart.sort = this.sort;

    this.valueProducts += (amount * priceUnit);

    this._snackBar.open('Produto adicionado ao carrinho com sucesso!', 'X', { duration: 4000 });
  }
}
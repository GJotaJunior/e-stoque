import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products-register',
  templateUrl: './products-register.component.html',
  styleUrls: ['./products-register.component.css']
})
export class ProductsRegisterComponent implements OnInit {

  productForm: FormGroup;

  constructor(
    private _firestore: AngularFirestore,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
        ]
      ],
      priceBar: [
        '',
        [
          Validators.required,
          Validators.pattern('^(\\d{1,}(,|.)\\d{2})$')
        ]
      ],
      priceDelivery: [
        '',
        [
          Validators.required,
          Validators.pattern('^(\\d{1,}(,|.)\\d{2})$')
        ]
      ]
    });
  }

  async registerProduct() {
    let name: string = this.productForm.controls['name'].value;
    let priceBar: number = Number.parseFloat((this.productForm.controls['priceBar'].value).replace(',', '.'));
    let priceDelivery: number = Number.parseFloat((this.productForm.controls['priceDelivery'].value).replace(',', '.'));
    let amountStock = 0;

    this._firestore.collection('products').add({
      name, priceBar, priceDelivery, amountStock
    })
      .then(
        () => this.productForm.reset()
      )

      this._snackBar.open('Cadastro de produto realizado com sucesso!', 'X', { duration: 4000 });
  }

  checkPrice(event: any) {
    let price: string = event.target.value;

    if (event.keyCode === 46 && price.split('.').length === 2 ||
      event.keyCode === 44 && price.split(',').length === 2)
      return false
    else if (event.keyCode == 46 && price.split(',').length === 2 ||
      event.keyCode == 44 && price.split('.').length === 2)
      return false
  }


  getNameFieldError(): string {
    let name = this.productForm.controls['name'];

    if (name.hasError('required'))
      return 'O campo é de preenchimento obrigatório';
  }

  getPriceBarFieldError(): string {
    let priceBar = this.productForm.controls['priceBar'];

    return (priceBar.hasError('pattern'))
      ? 'O campo deve ser preenchido com um valor válido. Ex.: 9,99 ou 9.99'
      : 'O campo é de preenchimento obrigatório';
  }

  getPriceDeliveryFieldError(): string {
    let priceDelivery = this.productForm.controls['priceDelivery'];

    return (priceDelivery.hasError('pattern'))
      ? 'O campo deve ser preenchido com um valor válido. Ex.: 9,99 ou 9.99'
      : 'O campo é de preenchimento obrigatório';
  }

  // Converts the price into float if user has placed an integer

  convertPrice(){
    let priceVerify: boolean = (this.productForm.controls['price'].value).replace(',', '.').includes('.');;

    if(!priceVerify && this.productForm.controls['price'].value)
      this.productForm.controls['price'].setValue(this.productForm.controls['price'].value + ',00');
  }
}

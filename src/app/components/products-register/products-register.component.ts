import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-products-register',
  templateUrl: './products-register.component.html',
  styleUrls: ['./products-register.component.css']
})
export class ProductsRegisterComponent implements OnInit {

  productForm: FormGroup;

  constructor(
    private _firestore: AngularFirestore,
    private formBuilder: FormBuilder,) { }

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
          Validators.pattern('^(\\d{1,3},\\d{2})$')
        ]
      ],
      priceDelivery: [
        '',
        [
          Validators.required,
          Validators.pattern('^(\\d{1,3},\\d{2})$')
        ]
      ]
    });
  }

  async registerProduct() {
    let name: string = this.productForm.controls['name'].value;
    let priceBar: string = this.productForm.controls['priceBar'].value;
    let priceDelivery: string = this.productForm.controls['priceDelivery'].value;

    this._firestore.collection('products').add({
      name, priceBar, priceDelivery
    })
    .then(
      () => this.productForm.reset()
    )
  }


  getNameFieldError(): string {
    let name = this.productForm.controls['name'];

    if (name.hasError('required'))
      return 'O campo é de preenchimento obrigatório';
  }

  getPriceBarFieldError(): string {
    let priceBar = this.productForm.controls['priceBar'];

    return (priceBar.hasError('pattern'))
      ? 'O campo deve ser preenchido com um valor válido'
      : 'O campo é de preenchimento obrigatório';
  }

  getPriceDeliveryFieldError(): string {
    let priceDelivery = this.productForm.controls['priceDelivery'];

    return (priceDelivery.hasError('pattern'))
      ? 'O campo deve ser preenchido com um valor válido'
      : 'O campo é de preenchimento obrigatório';
  }
}

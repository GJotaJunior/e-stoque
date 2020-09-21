import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private _firestore: AngularFirestore,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required
        ]
      ],
      value: [
        '',
        [
          Validators.required,
          Validators.pattern['R\$ ?\d{1,3},\d{2}']
        ]
      ],
      priceBar: [
        '',
        [
          Validators.required,
          Validators.pattern['R\$ ?\d{1,3},\d{2}']
        ]
      ],
      priceDelivery: [
        '',
        [
          Validators.required,
          Validators.pattern['R\$ ?\d{1,3},\d{2}']
        ]
      ]
    })
  }


  async registerProduct() {
    let name: string = this.registerForm.controls['name'].value;
    let value: string = this.registerForm.controls['value'].value;
    let priceBar: string = this.registerForm.controls['priceBar'].value;
    let priceDelivery: string = this.registerForm.controls['priceDelivery'].value;

    this._firestore.collection('products').add({
      name, value, priceBar, priceDelivery
    })
    .then(
      () => this.registerForm.reset()
    )
  }
}

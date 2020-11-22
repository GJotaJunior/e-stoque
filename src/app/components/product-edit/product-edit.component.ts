import { Component, Inject } from '@angular/core';
import { IProduct } from '../../shared/interfaces/iproduct';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent {

  productEditForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ProductEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProduct,
    private formBuilder: FormBuilder) {
    this.productEditForm = this.formBuilder.group({
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

  cancelEdit(): void {
    this.dialogRef.close();
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

  getPriceBarFieldError(): string {
    let priceBar = this.productEditForm.controls['priceBar'];

    return (priceBar.hasError('pattern'))
      ? 'O campo deve ser preenchido com um valor válido. Ex.: 9,99 ou 9.99'
      : 'O campo é de preenchimento obrigatório';
  }

  getPriceDeliveryFieldError(): string {
    let priceDelivery = this.productEditForm.controls['priceDelivery'];

    return (priceDelivery.hasError('pattern'))
      ? 'O campo deve ser preenchido com um valor válido. Ex.: 9,99 ou 9.99'
      : 'O campo é de preenchimento obrigatório';
  }

  // Converts the price into float if user has placed an integer

  convertPrice() {
    let priceBarVerify: boolean = (this.productEditForm.controls['priceBar'].value).replace(',', '.').includes('.');
    let priceDeliveryVerify: boolean = (this.productEditForm.controls['priceDelivery'].value).replace(',', '.').includes('.');

    if (!priceBarVerify && this.productEditForm.controls['priceBar'].value)
      this.productEditForm.controls['priceBar'].setValue(this.productEditForm.controls['priceBar'].value + ',00');

    if (!priceDeliveryVerify && this.productEditForm.controls['priceDelivery'].value)
      this.productEditForm.controls['priceDelivery'].setValue(this.productEditForm.controls['priceDelivery'].value + ',00');
  }

  saveProductEdited() {
    let priceBarVerify: boolean = typeof (this.productEditForm.controls['priceBar'].value) === 'string';
    let priceDeliveryVerify: boolean = typeof (this.productEditForm.controls['priceDelivery'].value) === 'string';

    if (priceBarVerify && priceDeliveryVerify) {
      let prices: any = {
        priceBarEdited: Number.parseFloat(this.productEditForm.controls['priceBar'].value.replace(',', '.')),
        priceDeliveryEdited: Number.parseFloat(this.productEditForm.controls['priceDelivery'].value.replace(',', '.'))
      }
      this.dialogRef.close(prices);
    }
  }
}


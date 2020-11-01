import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IProduct } from 'src/app/shared/interfaces/iproduct';

@Component({
  selector: 'app-product-delete',
  templateUrl: './product-delete.component.html',
  styleUrls: ['./product-delete.component.css']
})
export class ProductDeleteComponent {

  constructor(public dialogRef: MatDialogRef<ProductDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProduct) { }

  cancelDelete(): void {
    this.dialogRef.close();
  }
}

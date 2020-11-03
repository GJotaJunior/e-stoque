import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { AngularFirestore, AngularFirestoreCollection, DocumentData, QueryDocumentSnapshot } from 'angularfire2/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { IProduct } from '../../shared/interfaces/iproduct';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductEditComponent } from '../product-edit/product-edit.component';
import { ProductDeleteComponent } from '../product-delete/product-delete.component';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {


  displayedColumns: string[] = [
    'name',
    'priceBar',
    'priceDelivery',
    'amountStock'
  ];

  isAdminLogged: boolean = false;
  products: IProduct[] = [];
  uids: string[] = [];
  dataSource: MatTableDataSource<IProduct> = new MatTableDataSource([]);
  _db: AngularFirestoreCollection<unknown>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private _firestore: AngularFirestore,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _auth: AngularFireAuth) {
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
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.sort = this.sort;
      }
    );
  }

  ngOnInit(): void {
    this._auth.user.subscribe(
      user => {
        this._firestore.collection('users').doc(user.uid).valueChanges().subscribe(
          doc => {
            if (doc['isAdmin']) {
              this.displayedColumns.push('edit', 'delete')

              this.isAdminLogged = true;
            }
          }
        )
      }
    );
  }

  edit(product: IProduct) {
    const dialogRef = this._dialog.open(ProductEditComponent, {
      data: {
        uid: product.uid,
        name: product.name,
        priceBar: product.priceBar,
        priceDelivery: product.priceDelivery
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let newPriceBar: number = result.priceBarEdited;
        let newPriceDelivery: number = result.priceDeliveryEdited;

        if (!Number.isNaN(newPriceBar) && newPriceBar) {
          let index: number = this.products.indexOf(product);
          this.products[index].priceBar = newPriceBar;

          this._firestore.collection('products').doc(product.uid).update({
            priceBar: newPriceBar
          });
        }

        if (!Number.isNaN(newPriceDelivery) && newPriceDelivery) {
          let index: number = this.products.indexOf(product);
          this.products[index].priceDelivery = newPriceDelivery;

          this._firestore.collection('products').doc(product.uid).update({
            priceDelivery: newPriceDelivery
          });
        }

        this._snackBar.open('Preços atualizados com sucesso!', 'X', { duration: 4000 });
      }
    });
  }

  delete(product: IProduct) {
    let moves: Array<QueryDocumentSnapshot<DocumentData>> = [];

    this._firestore.collection("products").doc(product.uid).collection("moves").get().subscribe(
      (data) => {
        data.forEach(
          move => moves.push(
            move
          )
        )
      }
    )

    const dialogRef = this._dialog.open(ProductDeleteComponent, {
      data: {
        name: product.name,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (moves.length > 0)
          this._snackBar.open('Desculpe, mas não foi possível remover o produto, pois existe lançamentos no mesmo!', 'X', { duration: 4000 });
        else {
          this.products.splice(this.products.indexOf(product), 1);
          this._firestore.collection('products').doc(product.uid).delete();

          this._snackBar.open('Produto removido com sucesso!', 'X', { duration: 4000 });
        }
      }
    });

  }

}
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { IProduct } from '../../shared/interfaces/iproduct';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {


  displayedColumns: string[] = [
    'name',
    'priceBar',
    'priceDelivery'
  ];

  products = [];
  dataSource: MatTableDataSource<IProduct> = new MatTableDataSource([]);
  _db: AngularFirestoreCollection<unknown>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private _firestore: AngularFirestore) {
    this._db = this._firestore.collection('products', ref => ref.orderBy('name'));

    this._db.valueChanges({ idField: 'uid' }).subscribe(
      (data) => {
        data.forEach(product => {
          this.products.push({
            productId: product['uid'],
            name: product['name'],
            priceBar: product['priceBar'],
            priceDelivery: product['priceDelivery']
          });
        });
      }
    );

    this.dataSource = new MatTableDataSource(this.products);
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {

  }

}

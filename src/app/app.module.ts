import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AuthService } from './modules/auth/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ProductsComponent } from './components/products/products.component';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { OverlayModule } from '@angular/cdk/overlay';
import { TransactionComponent } from './components/transactions/transaction.component';
import { TransactionInComponent } from './components/transaction-in/transaction-in.component';
import { TransactionOutComponent } from './components/transaction-out/transaction-out.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductsRegisterComponent } from './components/products-register/products-register.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    TransactionComponent,
    ProductsComponent,
    TransactionInComponent,
    TransactionOutComponent,
    ProductsListComponent,
    ProductsRegisterComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatListModule,
    MatDividerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCardModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    OverlayModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatTabsModule,
    MatRadioModule,
    MatAutocompleteModule,
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AngularFireAuth,
    AuthService,
    MatSnackBar,
    AngularFireAuthGuard,
    AngularFirestore,
    FormBuilder
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { UsersComponent } from './users/users.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TransactionComponent } from './transactions/transaction.component';
import { ProductsComponent } from './products/products.component';

const toHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login'
  },
  {
    path: 'home',
    canActivate: [AngularFireAuthGuard],
    component: RegisterComponent
  },
  {
    path: 'login',
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: (() => redirectLoggedInTo(['home']))
    },
    component: LoginComponent
  },
  {
    path: 'forgor-password',
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: toHome
    },
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'users',
    canActivate: [AngularFireAuthGuard],
    component: UsersComponent
  },
  {
    path: 'transaction',
    canActivate: [AngularFireAuthGuard],
    component: TransactionComponent
  },
  {
    path: 'products',
    canActivate: [AngularFireAuthGuard],
    component: ProductsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

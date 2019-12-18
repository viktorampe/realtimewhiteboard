import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { PagesSharedModule } from '@campus/pages/shared';
import { UiModule } from '@campus/ui';
import { LoginComponent } from './components/login.component';
import { LoginViewModel } from './components/login.viewmodel';
import { PagesLoginRoutingModule } from './pages-login-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesLoginRoutingModule,
    UiModule,
    PagesSharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  declarations: [LoginComponent],
  providers: [LoginViewModel]
})
export class PagesLoginModule {}

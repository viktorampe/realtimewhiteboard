import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '../../../../node_modules/@angular/common/http';
import { SDKBrowserModule } from '../../../../node_modules/@diekeure/polpo-api-angular-sdk';

@NgModule({
  imports: [CommonModule, SDKBrowserModule.forRoot(), HttpClientModule]
})
export class DalModule {}

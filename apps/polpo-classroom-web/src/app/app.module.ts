import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SDKBrowserModule } from '@diekeure/polpo-api-angular-sdk';
import { NxModule } from '@nrwl/nx';
import { RouterModule } from '../../../../node_modules/@angular/router';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    SDKBrowserModule.forRoot(),
    HttpClientModule,
    BrowserModule,
    NxModule.forRoot(),
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', component: AppComponent },
      { path: 'login', loadChildren: '@campus/devlib#DevlibModule' }
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

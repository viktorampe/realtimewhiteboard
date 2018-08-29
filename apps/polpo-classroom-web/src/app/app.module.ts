import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { RouterModule } from '../../../../node_modules/@angular/router';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NxModule.forRoot(),
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', component: AppComponent },
      { path: 'login', loadChildren: '@campus/devlib#DevlibModule' }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

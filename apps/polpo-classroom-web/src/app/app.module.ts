import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NxModule } from '@nrwl/nx';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NxModule.forRoot(),
    RouterModule.forRoot(
      [ { path: '', redirectTo: 'bundles', pathMatch: 'full'}
        { path: 'bundles', loadChildren: '@campus/pages#BundlesModule' }],
      { initialNavigation: 'enabled', enableTracing: true }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DalModule } from '@campus/dal';
import { UiModule } from '@campus/ui';
import { NxModule } from '@nrwl/nx';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NxModule.forRoot(), DalModule.forRoot(), UiModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

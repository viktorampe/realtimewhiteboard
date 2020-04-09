import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { WhiteboardModule } from '@campus/whiteboard';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([], {
      initialNavigation: 'enabled'
    }),
    WhiteboardModule
  ],
  bootstrap: [AppComponent],
  providers: [],
  entryComponents: []
})
export class AppModule {
  constructor() {}
}

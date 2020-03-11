import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ENVIRONMENT_ICON_MAPPING_TOKEN } from '@campus/shared';
import { WhiteboardModule } from '@campus/whiteboard';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    WhiteboardModule
  ],
  providers: [
    {
      provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
      useValue: environment.iconMapping
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

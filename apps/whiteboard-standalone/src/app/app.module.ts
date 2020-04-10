import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DalModule } from '@campus/dal';
import { WhiteboardModule } from '@campus/whiteboard';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { PlayGroundComponent } from './play-ground/play-ground.component';

@NgModule({
  declarations: [AppComponent, PlayGroundComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    DalModule.forRoot({ apiBaseUrl: environment.api.APIBase }),
    WhiteboardModule,
    RouterModule.forRoot(
      [
        { path: '', pathMatch: 'full', redirectTo: 'whiteboard' },

        { path: 'whiteboard', component: PlayGroundComponent }
      ],
      {
        initialNavigation: 'enabled'
      }
    )
  ],
  bootstrap: [AppComponent],
  providers: [],
  entryComponents: []
})
export class AppModule {
  constructor() {}
}

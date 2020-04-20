import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { WhiteboardModule } from '@campus/whiteboard';
import { AppComponent } from './app.component';
import { RealtimeComponent } from './components/realtime/realtime.component';
import { SetupComponent } from './components/setup/setup.component';

@NgModule({
  declarations: [AppComponent, SetupComponent, RealtimeComponent],
  imports: [
    BrowserModule,
    WhiteboardModule,
    RouterModule.forRoot(
      [
        { path: '', component: SetupComponent },
        { path: 'session/:id', component: RealtimeComponent }
      ],
      { initialNavigation: 'enabled' }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

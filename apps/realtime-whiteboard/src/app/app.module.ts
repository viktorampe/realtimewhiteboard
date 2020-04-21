import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { WhiteboardModule } from '@campus/whiteboard';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { RealtimeComponent } from './components/realtime/realtime.component';
import { SetupComponent } from './components/setup/setup.component';
import { SessionsetupdialogComponent } from './ui/sessionsetupdialog/sessionsetupdialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SetupComponent,
    RealtimeComponent,
    SessionsetupdialogComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    WhiteboardModule,
    RouterModule.forRoot(
      [
        { path: '', component: SetupComponent },
        { path: 'session/:id', component: RealtimeComponent }
      ],
      { initialNavigation: 'enabled' }
    ),
    MatDialogModule
  ],
  entryComponents: [SessionsetupdialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

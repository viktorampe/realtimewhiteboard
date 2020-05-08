import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { WhiteboardModule } from '@campus/whiteboard';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { RealtimeComponent } from './components/realtime/realtime.component';
import { JoinsessionComponent } from './ui/joinsession/joinsession.component';
import { PlayertableComponent } from './ui/playertable/playertable.component';
import { SessiondetailsdialogComponent } from './ui/sessiondetailsdialog/sessiondetailsdialog.component';
import { SessionsetupdialogComponent } from './ui/sessionsetupdialog/sessionsetupdialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RealtimeComponent,
    SessionsetupdialogComponent,
    NavComponent,
    HomeComponent,
    PlayertableComponent,
    SessiondetailsdialogComponent,
    JoinsessionComponent
  ],
  imports: [
    BrowserModule,
    WhiteboardModule,
    RouterModule.forRoot(
      [
        { path: '', component: HomeComponent },
        { path: 'realtimesession/:id', component: RealtimeComponent }
      ],
      { initialNavigation: 'enabled' }
    ),
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatRippleModule,
    MatSnackBarModule
  ],
  entryComponents: [SessionsetupdialogComponent, SessiondetailsdialogComponent],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {}

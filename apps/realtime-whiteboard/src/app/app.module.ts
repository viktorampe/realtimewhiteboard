import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { WhiteboardModule } from '@campus/whiteboard';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { RealtimeComponent } from './components/realtime/realtime.component';
import { ActiveplayersdialogComponent } from './ui/activeplayersdialog/activeplayersdialog.component';
import { PlayertableComponent } from './ui/playertable/playertable.component';
import { SessionsetupdialogComponent } from './ui/sessionsetupdialog/sessionsetupdialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RealtimeComponent,
    SessionsetupdialogComponent,
    NavComponent,
    HomeComponent,
    ActiveplayersdialogComponent,
    PlayertableComponent
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
    MatTableModule
  ],
  entryComponents: [SessionsetupdialogComponent, ActiveplayersdialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

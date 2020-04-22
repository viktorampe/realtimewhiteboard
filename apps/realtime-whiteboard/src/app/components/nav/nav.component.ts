import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import RealtimeSession from '../../models/realtimesession';
import { RealtimeSessionService } from '../../services/realtime-session.service';
import { SessionsetupdialogComponent } from '../../ui/sessionsetupdialog/sessionsetupdialog.component';

@Component({
  selector: 'campus-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  session: RealtimeSession;

  constructor(
    private router: Router,
    private sessionService: RealtimeSessionService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.sessionService.currentRealtimeSession$.subscribe(
      (realtimesession: RealtimeSession) => {
        //session was deleted
        if (realtimesession === null) {
          this.router.navigate(['home']);
        } else {
          this.session = realtimesession;
        }
      }
    );
  }

  setupSession() {
    const dialogRef = this.dialog.open(SessionsetupdialogComponent, {
      width: '350px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
      this.startSession();
    });
  }

  private startSession() {
    // create session
    this.sessionService.createNewSession().subscribe(realtimeSession => {
      this.router.navigate(['realtimesession', realtimeSession.id]);
    });
  }

  stopSession() {
    this.sessionService.DeleteSessino(this.session.id);
  }
}

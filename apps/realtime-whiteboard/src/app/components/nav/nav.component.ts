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
        if (realtimesession !== null) {
          if (realtimesession.deleted === true) {
            this.router.navigate(['']);
          } else {
            this.session = realtimesession;
          }
        }
      }
    );
  }

  setupSession() {
    const dialogRef = this.dialog.open(SessionsetupdialogComponent, {
      width: '350px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result.sessionTitle);
        const realtimeSession = new RealtimeSession();
        realtimeSession.id = null;
        realtimeSession.title = result.sessionTitle;
        realtimeSession.pincode = 555555;
        realtimeSession.whiteboard = {
          title: 'realtime whiteboard',
          defaultColor: '#5D3284',
          cards: [],
          shelfCards: []
        };
        realtimeSession.players = [
          { id: null, sessionId: null, fullName: 'Vitkor' },
          { id: null, sessionId: null, fullName: 'Frederic' },
          { id: null, sessionId: null, fullName: 'Thomas' },
          { id: null, sessionId: null, fullName: 'Tom' },
          { id: null, sessionId: null, fullName: 'Karl' },
          { id: null, sessionId: null, fullName: 'David' },
          { id: null, sessionId: null, fullName: 'Bert' },
          { id: null, sessionId: null, fullName: 'Yannis' }
        ];
        this.startSession(realtimeSession);
      }
    });
  }

  private startSession(realtimeSession: RealtimeSession) {
    // create session
    this.sessionService.createNewSession(realtimeSession).subscribe(session => {
      this.router.navigate(['realtimesession', session.id]);
    });
  }

  stopSession() {
    this.sessionService.DeleteSession(this.session.id);
  }
}

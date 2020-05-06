import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import RealtimeSession from '../../models/realtimesession';
import { RealtimeWhiteboard } from '../../models/realtimewhiteboard';
import { RealtimeSessionService } from '../../services/realtime-session.service';
import { SessiondetailsdialogComponent } from '../../ui/sessiondetailsdialog/sessiondetailsdialog.component';
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
        this.session = realtimesession;
        console.log(this.session);
        if (this.session !== null) {
          if (this.session.lives === false) {
            this.router.navigate(['']);
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
        const realtimeSession = new RealtimeSession();
        realtimeSession.id = null;
        realtimeSession.title = result.sessionTitle;
        realtimeSession.pincode = result.sessionPincode;
        this.startSession(realtimeSession);
      }
    });
  }

  private startSession(realtimeSession: RealtimeSession) {
    // create whiteboard
    this.sessionService
      .createWhiteboard({
        title: 'realtime whiteboard',
        defaultColor: '#5D3284',
        cards: [],
        shelfCards: []
      })
      .subscribe((realtimeWhiteboard: RealtimeWhiteboard) => {
        // create session
        this.sessionService
          .createNewSession(realtimeSession, realtimeWhiteboard.id)
          .subscribe((sessionResponse: any) => {
            this.router.navigate(['realtimesession', sessionResponse.id]);
          });
      });
  }

  stopSession() {
    this.sessionService.DeleteSession(this.session.id);
  }

  addPlayer() {
    this.sessionService.createPlayer('new player');
  }

  openInfoModal() {
    const dialogRef = this.dialog.open(SessiondetailsdialogComponent, {
      width: '75%',
      data: {
        title: this.session.title,
        pincode: this.session.pincode,
        players: this.session.players
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // do something with result
      }
    });
  }
}

import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Player from '../../models/player';
import RealtimeSession from '../../models/realtimesession';
import { RealtimeWhiteboard } from '../../models/realtimewhiteboard';
import { ActiveplayerService } from '../../services/activeplayer/activeplayer.service';
import { RealtimeSessionService } from '../../services/realtimesession/realtime-session.service';
import { ActiveplayersdialogComponent } from '../../ui/activeplayersdialog/activeplayersdialog.component';
import { SessiondetailsdialogComponent } from '../../ui/sessiondetailsdialog/sessiondetailsdialog.component';
import { SessionsetupdialogComponent } from '../../ui/sessionsetupdialog/sessionsetupdialog.component';
import { ClipboardHelper } from '../../util/clipboardHelper';

@Component({
  selector: 'campus-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(100px)' }),
        animate(
          '0.3s ease-in',
          style({ opacity: 1, transform: 'translate(0%)' })
        )
      ])
    ])
  ]
})
export class NavComponent implements OnInit {
  navMinimized = true;
  navCardDetails = false;

  session$ = new BehaviorSubject<RealtimeSession>(null);

  constructor(
    private router: Router,
    private sessionService: RealtimeSessionService,
    private activePlayerService: ActiveplayerService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // subscribe on realtime session updates
    this.sessionService.currentRealtimeSession$.subscribe(
      (realtimesession: RealtimeSession) => {
        this.setBehaviorSubjects(realtimesession);
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
        const teacher = new Player();
        teacher.fullName = result.teacherName;
        teacher.isTeacher = true;
        this.startSession(realtimeSession, teacher);
      }
    });
  }

  private startSession(realtimeSession: RealtimeSession, teacher: Player) {
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
            // create player
            this.sessionService
              .createPlayer(teacher)
              .subscribe((player: Player) => {
                // set active player
                this.activePlayerService.setActivePlayer(player);
                // nav to realtime session
                this.router.navigate(['realtimesession', sessionResponse.id]);
              });
          });
      });
  }

  stopSession() {
    this.sessionService
      .deleteSession(this.session$.getValue().id)
      .subscribe(() => {
        this.router.navigate(['bye']);
      });
  }

  openInfoModal() {
    const dialogRef = this.dialog.open(SessiondetailsdialogComponent, {
      width: '50%',
      data: {
        title: this.session$.getValue().title,
        pincode: this.session$.getValue().pincode,
        players: this.session$.getValue().players,
        sharelink: location.href
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // do something with result
      }
    });
  }

  copyLinkToClipboard() {
    ClipboardHelper.copyMessage(location.href);
    this._snackBar.open('Copied', null, { duration: 2000 });
  }

  openActivePlayersModal() {
    const dialogRef = this.dialog.open(ActiveplayersdialogComponent, {
      width: '30%',
      data: {
        title: this.session$.getValue().title,
        players: this.session$.getValue().players
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // do something with result
      }
    });
  }

  showCardDetails() {
    this.navCardDetails = true;
  }

  toggleNav() {
    this.navMinimized = !this.navMinimized;
  }

  closeCardDetails() {
    this.navCardDetails = false;
  }

  private setBehaviorSubjects(realtimeSession: RealtimeSession) {
    if (realtimeSession !== null) {
      if (realtimeSession.deleted === true) {
        this.router.navigate(['bye']);
        return;
      }
      this.sortCards(realtimeSession);
    }
    this.session$.next(realtimeSession);
  }

  private sortCards(realtimeSession: RealtimeSession) {
    if (realtimeSession.whiteboard) {
      if (realtimeSession.whiteboard.cards) {
        realtimeSession.whiteboard.cards = realtimeSession.whiteboard.cards.sort(
          (a, b) => {
            if (a.id > b.id) return -1;
            if (a.id < b.id) return 1;
          }
        );
      }
    }
  }
}

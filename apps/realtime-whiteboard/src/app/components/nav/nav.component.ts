import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { RealtimeSessionService } from '../../services/realtime-session.service';
import { SessionsetupdialogComponent } from '../../ui/sessionsetupdialog/sessionsetupdialog.component';

@Component({
  selector: 'campus-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  constructor(
    private router: Router,
    private sessionService: RealtimeSessionService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

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

  startSession() {
    // create session
    this.sessionService.createNewSession().subscribe(realtimeSession => {
      this.router.navigate(['realtimesession', realtimeSession.id]);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { APIService } from '../../API.service';
import { SessionsetupdialogComponent } from '../../ui/sessionsetupdialog/sessionsetupdialog.component';
import { SessionHelper } from '../../util/sessionhelper';

@Component({
  selector: 'campus-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  players: string[] = [
    'Viktor',
    'Frederic',
    'Thomas',
    'Tom',
    'Karl',
    'David',
    'Bert',
    'Yannis'
  ];

  constructor(
    private router: Router,
    private apiService: APIService,
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
    this.apiService
      .CreateSession({
        title: 'My first session',
        pincode: 123456,
        whiteboard: SessionHelper.getEmptyWhiteboardString()
      })
      .then(session => {
        // add players to session
        this.players.forEach(playerName => {
          this.apiService.CreatePlayer({
            sessionID: session.id,
            fullName: playerName
          });
        });
        // navigate to session
        this.router.navigate(['session', session.id]);
      })
      .catch(err => console.log(err));
  }
}

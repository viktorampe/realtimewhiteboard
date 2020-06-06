import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import Player from '../../models/player';
import { RealtimeSessionService } from '../../services/realtimesession/realtime-session.service';
import { SessiondetailsdialogComponent } from '../sessiondetailsdialog/sessiondetailsdialog.component';

@Component({
  selector: 'campus-activeplayersdialog',
  templateUrl: './activeplayersdialog.component.html',
  styleUrls: ['./activeplayersdialog.component.scss']
})
export class ActiveplayersdialogComponent implements OnInit {
  players$ = new BehaviorSubject<Player[]>(null);

  constructor(
    public dialogRef: MatDialogRef<SessiondetailsdialogComponent>,
    private sessionService: RealtimeSessionService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.players$.next(this.data.players);
    console.log(this.players$.value);
  }

  removePlayer(player: Player) {
    this.sessionService.deletePlayer(player).subscribe(() => {});
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import Player from '../../models/player';
import { RealtimeSessionService } from '../../services/realtimesession/realtime-session.service';
import { ClipboardHelper } from '../../util/clipboardHelper';

@Component({
  selector: 'campus-sessiondetailsdialog',
  templateUrl: './sessiondetailsdialog.component.html',
  styleUrls: ['./sessiondetailsdialog.component.scss']
})
export class SessiondetailsdialogComponent implements OnInit {
  constructor(
    private _snackBar: MatSnackBar,
    private sessionService: RealtimeSessionService,
    public dialogRef: MatDialogRef<SessiondetailsdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  copyMessage() {
    ClipboardHelper.copyMessage(location.href);
    this.openSnackBar('Copied');
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
      verticalPosition: 'top'
    });
  }

  removePlayer(player: Player) {
    this.sessionService.deletePlayer(player).subscribe(() => {});
  }
}

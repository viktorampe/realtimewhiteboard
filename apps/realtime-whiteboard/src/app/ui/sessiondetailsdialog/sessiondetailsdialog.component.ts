import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'campus-sessiondetailsdialog',
  templateUrl: './sessiondetailsdialog.component.html',
  styleUrls: ['./sessiondetailsdialog.component.scss']
})
export class SessiondetailsdialogComponent implements OnInit {
  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SessiondetailsdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.openSnackBar('Copied');
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
      verticalPosition: 'top'
    });
  }
}

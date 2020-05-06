import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'campus-sessiondetailsdialog',
  templateUrl: './sessiondetailsdialog.component.html',
  styleUrls: ['./sessiondetailsdialog.component.scss']
})
export class SessiondetailsdialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SessiondetailsdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
}

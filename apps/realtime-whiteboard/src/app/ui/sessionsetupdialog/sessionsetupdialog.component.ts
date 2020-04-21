import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'campus-sessionsetupdialog',
  templateUrl: './sessionsetupdialog.component.html',
  styleUrls: ['./sessionsetupdialog.component.scss']
})
export class SessionsetupdialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SessionsetupdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
}

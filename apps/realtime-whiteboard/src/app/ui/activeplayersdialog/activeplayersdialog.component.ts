import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'campus-activeplayersdialog',
  templateUrl: './activeplayersdialog.component.html',
  styleUrls: ['./activeplayersdialog.component.scss']
})
export class ActiveplayersdialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ActiveplayersdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
}

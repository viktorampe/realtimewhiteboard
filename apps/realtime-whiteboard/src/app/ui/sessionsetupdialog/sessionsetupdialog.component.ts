import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'campus-sessionsetupdialog',
  templateUrl: './sessionsetupdialog.component.html',
  styleUrls: ['./sessionsetupdialog.component.scss']
})
export class SessionsetupdialogComponent implements OnInit {
  sessionTitle: String = '';
  sessionPincode: number;

  titleFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);

  pincodeFormControl = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.max(999999)
  ]);

  constructor(
    public dialogRef: MatDialogRef<SessionsetupdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  createSession() {
    this.dialogRef.close({
      sessionTitle: this.sessionTitle,
      sessionPincode: this.sessionPincode
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}

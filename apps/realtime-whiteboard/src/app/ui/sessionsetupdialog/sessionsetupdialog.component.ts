import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'campus-sessionsetupdialog',
  templateUrl: './sessionsetupdialog.component.html',
  styleUrls: ['./sessionsetupdialog.component.scss']
})
export class SessionsetupdialogComponent implements OnInit {
  message: string;

  titleFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2)
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
    if (
      this.titleFormControl.valid &&
      this.nameFormControl.valid &&
      this.pincodeFormControl.valid
    ) {
      this.dialogRef.close({
        sessionTitle: this.titleFormControl.value,
        teacherName: this.nameFormControl.value,
        sessionPincode: this.pincodeFormControl.value
      });
    } else {
      this.message = 'Some fields are wrong';
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}

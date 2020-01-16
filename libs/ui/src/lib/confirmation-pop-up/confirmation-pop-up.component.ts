import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface ConfirmationActionInterface {
  icon: string;
  label: string;
  handler: () => any;
}

@Component({
  selector: 'campus-confirmation-pop-up',
  templateUrl: './confirmation-pop-up.component.html',
  styleUrls: ['./confirmation-pop-up.component.scss']
})
export class ConfirmationPopUpComponent {
  title: string;
  message: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmationPopUpComponent>
  ) {
    this.title = data.title;
    this.message = data.message;
  }

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}

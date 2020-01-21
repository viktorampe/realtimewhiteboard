import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'campus-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  title: string;
  message: string;
  disableConfirm: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<ConfirmationModalComponent>
  ) {
    this.title = data.title;
    this.message = data.message;
    this.disableConfirm = data.disableConfirm;
  }

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    if (this.disableConfirm) return; // workaround because stop propagation does not work
    this.dialogRef.close(true);
  }
}

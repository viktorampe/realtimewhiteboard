import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'campus-content-preview-dialog',
  templateUrl: './content-preview-dialog.component.html',
  styleUrls: ['./content-preview-dialog.component.scss']
})
export class ContentPreviewDialogComponent implements OnInit {
  public loading: boolean;
  public errored: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      url: string;
    },
    private dialogRef: MatDialogRef<ContentPreviewDialogComponent>
  ) {
    this.loading = true;
    this.errored = false;
  }

  ngOnInit() {}

  public imageLoaded() {
    this.loading = false;
  }

  public imageErrored() {
    this.loading = false;
    this.errored = true;
  }

  public close() {
    this.dialogRef.close();
  }
}

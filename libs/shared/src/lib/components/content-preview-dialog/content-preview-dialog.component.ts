import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'campus-content-preview-dialog',
  templateUrl: './content-preview-dialog.component.html',
  styleUrls: ['./content-preview-dialog.component.scss']
})
export class ContentPreviewDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      url: string;
    },
    private dialogRef: MatDialogRef<ContentPreviewDialogComponent>
  ) {}

  ngOnInit() {}

  public close() {
    this.dialogRef.close();
  }
}

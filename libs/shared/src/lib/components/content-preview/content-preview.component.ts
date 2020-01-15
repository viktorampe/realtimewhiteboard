import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'campus-content-preview',
  templateUrl: './content-preview.component.html',
  styleUrls: ['./content-preview.component.scss']
})
export class ContentPreviewComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      url: string;
    },
    private dialogRef: MatDialogRef<ContentPreviewComponent>
  ) {}

  ngOnInit() {}

  public close() {
    this.dialogRef.close();
  }
}

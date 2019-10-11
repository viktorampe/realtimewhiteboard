import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  // selector: 'campus-timeline-editor',
  templateUrl: './timeline-editor.component.html',
  styleUrls: ['./timeline-editor.component.scss']
})
export class TimelineEditorComponent implements OnInit {
  apiBase: string;
  eduContentMetadataId: number;

  constructor() {}

  ngOnInit() {
    this.apiBase = environment.api.APIBase;
    this.eduContentMetadataId = 19; // example
  }
}

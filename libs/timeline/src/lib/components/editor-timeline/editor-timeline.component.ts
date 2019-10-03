import { Component, OnInit } from '@angular/core';
import { EditorViewModel } from './../editor.viewmodel';

@Component({
  selector: 'campus-editor-timeline',
  templateUrl: './editor-timeline.component.html',
  styleUrls: ['./editor-timeline.component.scss']
})
export class EditorTimelineComponent implements OnInit {
  public response;

  constructor(private editorViewModel: EditorViewModel) {}

  ngOnInit() {}

  getResponse() {
    this.response = this.editorViewModel.getTimelineConfig();
  }
}

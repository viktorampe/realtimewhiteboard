import { Component, OnInit } from '@angular/core';
import { EditorViewModel } from '../editor.viewmodel';

@Component({
  selector: 'campus-editor-timeline',
  templateUrl: './editor-timeline.component.html',
  styleUrls: ['./editor-timeline.component.scss']
})
export class EditorTimelineComponent implements OnInit {
  constructor(private viewModel: EditorViewModel) {}

  ngOnInit() {}
}

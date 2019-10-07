import { Component, OnInit } from '@angular/core';
import { TimelineDateFixture } from '../../+fixtures/timeline-date.fixture';
import { TimelineSlideFixture } from '../../+fixtures/timeline-slide.fixture';

@Component({
  selector: 'campus-editor-timeline',
  templateUrl: './editor-timeline.component.html',
  styleUrls: ['./editor-timeline.component.scss']
})
export class EditorTimelineComponent implements OnInit {
  slide = new TimelineSlideFixture({
    start_date: new TimelineDateFixture({ hour: 11, minute: 55 })
  });
  constructor() {}

  ngOnInit() {}
}

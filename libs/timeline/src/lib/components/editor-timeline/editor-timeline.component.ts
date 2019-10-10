import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TimelineSlideFixture } from '../../+fixtures/timeline-slide.fixture';
import {
  TimelineViewSlideInterface,
  TIMELINE_SLIDE_TYPES
} from '../../interfaces/timeline';

@Component({
  selector: 'campus-editor-timeline',
  templateUrl: './editor-timeline.component.html',
  styleUrls: ['./editor-timeline.component.scss']
})
export class EditorTimelineComponent implements OnInit {
  public slides$: Observable<TimelineViewSlideInterface[]>;

  constructor() {
    this.slides$ = new BehaviorSubject([
      {
        type: TIMELINE_SLIDE_TYPES.ERA,
        viewSlide: new TimelineSlideFixture(),
        label: 'januari - februari 2019'
      },
      {
        type: TIMELINE_SLIDE_TYPES.SLIDE,
        viewSlide: new TimelineSlideFixture(),
        label: 'januari 2019'
      },
      {
        type: TIMELINE_SLIDE_TYPES.SLIDE,
        viewSlide: new TimelineSlideFixture(),
        label: 'februari 2019'
      },
      {
        type: TIMELINE_SLIDE_TYPES.SLIDE,
        viewSlide: new TimelineSlideFixture(),
        label: 'maart 2019'
      }
    ] as TimelineViewSlideInterface[]);
  }

  ngOnInit() {}

  noop(): void {}
}

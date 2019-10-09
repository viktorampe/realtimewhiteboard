import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TimelineSlideFixture } from '../../+fixtures/timeline-slide.fixture';
import { TimelineViewSlideInterface } from '../../interfaces/timeline';
import { EditorViewModel } from '../editor.viewmodel';

@Component({
  selector: 'campus-editor-timeline',
  templateUrl: './editor-timeline.component.html',
  styleUrls: ['./editor-timeline.component.scss']
})
export class EditorTimelineComponent implements OnInit {
  public slides$: Observable<TimelineViewSlideInterface[]>;

  constructor(private editorViewModel: EditorViewModel) {
    this.editorViewModel.getTimeline(123);

    this.slides$ = new BehaviorSubject([
      {
        type: 'era',
        viewSlide: new TimelineSlideFixture(),
        label: 'januari - februari 2019'
      },
      {
        type: 'slide',
        viewSlide: new TimelineSlideFixture(),
        label: 'januari 2019'
      },
      {
        type: 'slide',
        viewSlide: new TimelineSlideFixture(),
        label: 'februari 2019'
      },
      {
        type: 'slide',
        viewSlide: new TimelineSlideFixture(),
        label: 'maart 2019'
      }
    ] as TimelineViewSlideInterface[]);
  }

  ngOnInit() {}

  noop(): void {}
}

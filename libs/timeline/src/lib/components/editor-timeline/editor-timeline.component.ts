import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TimelineSlideFixture } from '../../+fixtures/timeline-slide.fixture';
import { TimelineViewSlideInterface } from '../../interfaces/timeline';
import { FileUploadResult } from '../slide-detail/slide-detail.component';

@Component({
  selector: 'campus-editor-timeline',
  templateUrl: './editor-timeline.component.html',
  styleUrls: ['./editor-timeline.component.scss']
})
export class EditorTimelineComponent implements OnInit {
  slides = [
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
  ];

  public activeSlide = this.slides[1];
  public fileUploadResult: FileUploadResult;
  public slides$: Observable<TimelineViewSlideInterface[]>;

  constructor() {
    this.slides$ = new BehaviorSubject(this
      .slides as TimelineViewSlideInterface[]);
  }

  ngOnInit() {}

  noop(): void {}

  handleFileUpload(file: File) {
    this.fileUploadResult = {
      url: 'www.some-url.com'
    };
  }
}

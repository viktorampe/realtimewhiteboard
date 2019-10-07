import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import {
  TimelineConfigInterface,
  TimelineDateInterface,
  TimelineSlideInterface
} from '../interfaces/timeline';
import { EDITOR_HTTP_SERVICE_TOKEN } from '../services/editor-http.service';
import { EditorHttpServiceInterface } from '../services/editor-http.service.interface';
import {
  TimelineEraInterface,
  TimelineViewSlideInterface
} from './../interfaces/timeline';

@Injectable({
  providedIn: 'root'
})
export class EditorViewModel {
  private eduContentId: number;
  private data$ = new BehaviorSubject<TimelineConfigInterface>(null);
  private activeSlideId$: Observable<number>;
  public viewSlides$: Observable<TimelineViewSlideInterface[]>;

  public activeSlideDetail$: Observable<TimelineViewSlideInterface>;

  // where does the eduContentId and eduContentMetadataId come from?
  // the component? DI?
  constructor(
    @Inject(EDITOR_HTTP_SERVICE_TOKEN)
    private editorHttpService: EditorHttpServiceInterface
  ) {
    this.initialise();
  }

  private initialise() {
    this.eduContentId = 19;
    this.setSourceStreams(this.eduContentId);
    this.setIntermediateStreams();
    this.setPresentationStreams();
  }

  private setSourceStreams(eduContentId) {
    this.editorHttpService.getJson(eduContentId).subscribe(timeline => {
      this.data$.next(timeline);
    });

    this.activeSlideId$ = new BehaviorSubject<number>(null);
  }

  private setIntermediateStreams() {
    this.viewSlides$ = this.data$.pipe(
      map(data => this.mapToViewSlides(data.eras, data.events))
    );
  }

  private setPresentationStreams() {
    this.activeSlideDetail$ = this.activeSlideId$.pipe(
      withLatestFrom(this.viewSlides$),
      map(([activeSlideId, viewSlides]) => {
        return viewSlides[activeSlideId];
      })
    );
  }

  private mapToViewSlides(
    eras: TimelineEraInterface[],
    slides: TimelineSlideInterface[]
  ): TimelineViewSlideInterface[] {
    const viewEras = eras.map(era => ({
      type: 'era' as ('era' | 'slide'),
      viewSlide: era,
      date: this.transformTimelineDateToJsDate(era.start_date),
      label:
        (era.text && era.text.headline) ||
        era.start_date.display_date ||
        this.transformTimelineDateToJsDate(era.start_date).toLocaleDateString()
    }));

    const viewSlides = slides.map(slide => ({
      type: 'slide' as ('era' | 'slide'),
      viewSlide: slide,
      date: this.transformTimelineDateToJsDate(slide.start_date),
      label:
        slide.display_date ||
        slide.start_date.display_date ||
        this.transformTimelineDateToJsDate(
          slide.start_date
        ).toLocaleDateString()
    }));

    const sortedList = [...viewEras, ...viewSlides].sort((a, b) => {
      if (a.date === b.date) {
        return a.type > b.type ? 1 : -1;
      }

      return a.date > b.date ? 1 : -1;
    });

    return sortedList;
  }

  private transformTimelineDateToJsDate(
    timelineDate: TimelineDateInterface
  ): Date {
    return new Date(
      timelineDate.year,
      timelineDate.month - 1, // js date object month is zero based
      timelineDate.day ? timelineDate.day : 0
      // timelineDate.hour ? timelineDate.hour : 0,
      // timelineDate.minute ? timelineDate.minute : 0,
      // timelineDate.second ? timelineDate.second : 0,
      // timelineDate.millisecond ? timelineDate.millisecond : 0
    );
  }
}

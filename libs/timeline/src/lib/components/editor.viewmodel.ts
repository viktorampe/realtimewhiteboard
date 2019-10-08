import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import {
  filter,
  map,
  mapTo,
  shareReplay,
  switchMapTo,
  withLatestFrom
} from 'rxjs/operators';
import {
  TimelineConfigInterface,
  TimelineDateInterface,
  TimelineSettingsInterface,
  TimelineSlideInterface,
  TIMELINE_SLIDE_TYPES
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
  private activeSlideId$ = new BehaviorSubject<number>(null);

  public activeSlideDetail$: Observable<TimelineViewSlideInterface>;
  public slideList$: Observable<TimelineViewSlideInterface[]>;
  public settings$: Observable<TimelineSettingsInterface>;
  public isFormDirty$: Observable<boolean>;

  // where does the eduContentId and eduContentMetadataId come from?
  // the component? DI?
  constructor(
    @Inject(EDITOR_HTTP_SERVICE_TOKEN)
    private editorHttpService: EditorHttpServiceInterface
  ) {
    this.initialise();
  }

  private initialise() {
    this.eduContentId = 19; // TODO make variable
    this.setSourceStreams(this.eduContentId);
    this.setPresentationStreams();
  }

  private setSourceStreams(eduContentId) {
    this.editorHttpService.getJson(eduContentId).subscribe(timeline => {
      this.data$.next(timeline);
    });
  }

  private setPresentationStreams() {
    this.slideList$ = this.data$.pipe(
      filter(data => !!data),
      map(data => this.mapToViewSlides(data.eras, data.events)),
      shareReplay(1)
    );

    this.activeSlideDetail$ = this.getActiveSlideDetail();
    this.settings$ = this.getSettings();
    this.isFormDirty$ = new BehaviorSubject(false);
  }

  private getActiveSlideDetail(): Observable<TimelineViewSlideInterface> {
    const detailWithActiveSlideId$ = this.activeSlideId$.pipe(
      filter(activeSlideId => Number.isInteger(activeSlideId)),
      withLatestFrom(this.slideList$),
      map(([activeSlideId, viewSlides]) => viewSlides[activeSlideId])
    );

    const detailWithoutActiveSlideId$ = this.activeSlideId$.pipe(
      filter(activeSlideId => !Number.isInteger(activeSlideId)),
      mapTo(null)
    );

    return merge(detailWithActiveSlideId$, detailWithoutActiveSlideId$);
  }

  private getSettings(): Observable<TimelineSettingsInterface> {
    const settingsWithoutActiveSlideId$ = this.activeSlideId$.pipe(
      filter(activeSlideId => !Number.isInteger(activeSlideId)),
      switchMapTo(this.data$),
      filter(data => !!data),
      map(data => ({
        title: data.title,
        scale: data.scale,
        options: data.options
      }))
    );

    const settingsWithActiveSlideId$ = this.activeSlideId$.pipe(
      filter(activeSlideId => Number.isInteger(activeSlideId)),
      mapTo(null)
    );

    return merge(settingsWithoutActiveSlideId$, settingsWithActiveSlideId$);
  }

  private mapToViewSlides(
    eras: TimelineEraInterface[],
    slides: TimelineSlideInterface[],
    title?: TimelineSlideInterface
  ): TimelineViewSlideInterface[] {
    const viewEras = eras.map(era => ({
      type: TIMELINE_SLIDE_TYPES.ERA,
      viewSlide: era,
      date: this.transformTimelineDateToJsDate(era.start_date),
      label:
        (era.text && era.text.headline) ||
        this.transformTimelineDateToLabel(era.start_date)
    }));

    const viewSlides = slides.map(slide => ({
      type: TIMELINE_SLIDE_TYPES.SLIDE,
      viewSlide: slide,
      date: this.transformTimelineDateToJsDate(slide.start_date),
      label:
        slide.display_date ||
        this.transformTimelineDateToLabel(slide.start_date)
    }));

    const slideList = [...viewEras, ...viewSlides].sort((a, b) => {
      if (a.date === b.date) {
        return a.type > b.type ? 1 : -1;
      }

      return a.date > b.date ? 1 : -1;
    });

    if (title) {
      const viewTitle = {
        type: TIMELINE_SLIDE_TYPES.TITLE,
        viewSlide: title,
        label:
          title.display_date ||
          (title.start_date &&
            this.transformTimelineDateToLabel(title.start_date)) ||
          'Titel',
        date: null
      };
      return [viewTitle, ...slideList];
    }

    return slideList;
  }

  private transformTimelineDateToLabel(
    timelineDate: TimelineDateInterface
  ): string {
    return (
      timelineDate.display_date ||
      (timelineDate.day ? timelineDate.day + '-' : '') +
        (timelineDate.month ? timelineDate.month + '-' : '') +
        timelineDate.year
    );
  }

  private transformTimelineDateToJsDate(
    timelineDate: TimelineDateInterface
  ): Date {
    return new Date(
      timelineDate.year,
      timelineDate.month ? timelineDate.month - 1 : 0, // js date object month is zero based
      timelineDate.day ? timelineDate.day : 1,
      timelineDate.hour ? timelineDate.hour : 0,
      timelineDate.minute ? timelineDate.minute : 0,
      timelineDate.second ? timelineDate.second : 0,
      timelineDate.millisecond ? timelineDate.millisecond : 0
    );
  }
}

import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  shareReplay,
  switchMapTo,
  take
} from 'rxjs/operators';
import {
  TimelineConfigInterface,
  TimelineDateInterface,
  TimelineSettingsInterface,
  TimelineSlideInterface,
  TIMELINE_SLIDE_TYPES
} from '../interfaces/timeline';
import { EDITOR_HTTP_SERVICE_TOKEN } from '../services/editor-http.service';
import {
  EditorHttpServiceInterface,
  StorageInfoInterface
} from '../services/editor-http.service.interface';
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

  // stores temporary value for new slide
  // always emit this in activeSlide when there is a value
  // emit null in setting$ when there is a value
  private newSlide$ = new BehaviorSubject<TimelineViewSlideInterface>(null);
  private showSettings$: Observable<boolean>;
  private _activeSlide$: BehaviorSubject<TimelineViewSlideInterface>;
  private _isFormDirty$: BehaviorSubject<boolean>;

  public activeSlide$: Observable<TimelineViewSlideInterface>;
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

  public openSettings() {
    if (!this.isSafeToNavigate()) return;

    this._activeSlide$.next(null);
    this.newSlide$.next(null);
  }

  public updateSettings(newSettings: TimelineSettingsInterface) {
    const data = { ...this.data$.value, ...newSettings };

    this.data$.next(data);
  }

  public createSlide() {
    if (!this.isSafeToNavigate()) return;

    const data = this.data$.value;

    this.newSlide$.next({
      type: data.title
        ? TIMELINE_SLIDE_TYPES.SLIDE
        : TIMELINE_SLIDE_TYPES.TITLE,
      label: 'Naamloos',
      date: null,
      viewSlide: {}
    });
    this._activeSlide$.next(null);
  }

  public upsertSlide(updatedSlide: TimelineViewSlideInterface) {
    const data = this.data$.value;
    const activeSlide = this._activeSlide$.value;

    if (updatedSlide.type === TIMELINE_SLIDE_TYPES.TITLE) {
      data.title = updatedSlide.viewSlide;
    } else if (updatedSlide.type === TIMELINE_SLIDE_TYPES.SLIDE) {
      data.events.push(updatedSlide.viewSlide as TimelineSlideInterface);
    } else if (updatedSlide.type === TIMELINE_SLIDE_TYPES.ERA) {
      data.eras.push(updatedSlide.viewSlide as TimelineEraInterface);
    }

    // Nexting data causes the slideList to be updated
    this.data$.next(data);

    // If it's an update and not an insert, delete what we had before this
    if (activeSlide) {
      this.deleteActiveSlide();
    }

    // With the slideList updated, we can select the new active slide
    this.slideList$.pipe(take(1)).subscribe(slideList => {
      const slideItem = slideList.find(
        slideListItem => slideListItem.viewSlide === updatedSlide.viewSlide
      );

      this._activeSlide$.next(slideItem);
    });
  }

  public deleteActiveSlide() {
    const data = this.data$.value;
    const activeSlide = this._activeSlide$.value;

    // Bail out if we don't have anything selected
    if (!activeSlide) return;

    if (activeSlide.type === TIMELINE_SLIDE_TYPES.TITLE) {
      data.title = null;
    } else if (activeSlide.type === TIMELINE_SLIDE_TYPES.SLIDE) {
      data.events = data.events.filter(
        event => event !== activeSlide.viewSlide
      );
    } else if (activeSlide.type === TIMELINE_SLIDE_TYPES.ERA) {
      data.eras = data.eras.filter(era => era !== activeSlide.viewSlide);
    }

    // Select nothing, since the previously active slide was deleted
    this._activeSlide$.next(null);

    this.data$.next(data);
  }

  public setActiveSlide(slide: TimelineViewSlideInterface) {
    if (!this.isSafeToNavigate()) return;

    this._activeSlide$.next(slide);
  }

  /**
   * Returns true only when it's safe to proceed.
   * This means: the user has no unsaved changes or the user agreed to discard any unsaved changes.
   */
  private isSafeToNavigate(): boolean {
    const formDirty = this._isFormDirty$.value;

    if (formDirty) {
      return confirm(
        'Let op! Er zijn niet opgeslagen wijzigingen. Doorgaan zonder wijzigingen op te slaan?'
      );
    } else {
      return true;
    }
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

    this._activeSlide$ = new BehaviorSubject<TimelineViewSlideInterface>(null);
    this.activeSlide$ = this._activeSlide$.asObservable();
    this.showSettings$ = this.showSettings();
    this.activeSlideDetail$ = this.getActiveSlideDetail();
    this.settings$ = this.getSettings();
    this._isFormDirty$ = new BehaviorSubject(false);
    this.isFormDirty$ = this._isFormDirty$.asObservable();
  }

  private showSettings() {
    return this._activeSlide$.pipe(
      combineLatest(this.newSlide$),
      map(([activeSlide, newSlide]) => !activeSlide && !newSlide),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  private getActiveSlideDetail(): Observable<TimelineViewSlideInterface> {
    const detailWithActiveSlide$ = this._activeSlide$.pipe(
      filter(activeSlide => !!activeSlide),
      map(activeSlide => ({ ...activeSlide }))
    );

    const detailWithoutActiveSlide$ = this.showSettings$.pipe(
      filter(showSettings => showSettings),
      mapTo(null)
    );

    const detailWithNewSlide$ = this.newSlide$.pipe(
      filter(newSlide => !!newSlide)
    );

    return merge(
      detailWithActiveSlide$,
      detailWithoutActiveSlide$,
      detailWithNewSlide$
    );
  }

  private getSettings(): Observable<TimelineSettingsInterface> {
    const settingsWithoutActiveSlide$ = this.showSettings$.pipe(
      filter(showSettings => showSettings),
      switchMapTo(this.data$),
      filter(data => !!data),
      map(data => ({
        title: data.title,
        scale: data.scale,
        options: data.options
      }))
    );

    const settingsWithActiveSlide$ = this.showSettings$.pipe(
      filter(showSettings => !showSettings),
      mapTo(null)
    );

    return merge(settingsWithoutActiveSlide$, settingsWithActiveSlide$);
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

  getTimeline(
    eduContentMetadataId: number
  ): Observable<TimelineConfigInterface> {
    return this.editorHttpService.getJson(eduContentMetadataId);
  }

  updateTimeline(
    eduContentMetadataId: number,
    data: TimelineConfigInterface
  ): Observable<boolean> {
    return this.editorHttpService.setJson(eduContentMetadataId, data);
  }

  previewTimeline(eduContentId: number, eduContentMetadataId: number): string {
    return this.editorHttpService.getPreviewUrl(
      eduContentId,
      eduContentMetadataId
    );
  }

  uploadFile(
    eduContentId: number,
    file: File
  ): Observable<StorageInfoInterface> {
    return this.editorHttpService.uploadFile(eduContentId, file);
  }
}

import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable } from 'rxjs';
import {
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
  EditorHttpSettingsInterface,
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
  private data$ = new BehaviorSubject<TimelineConfigInterface>(null);

  // stores temporary value for new slide
  // always emit this in activeSlide when there is a value
  // emit null in setting$ when there is a value
  private newSlide$ = new BehaviorSubject<TimelineViewSlideInterface>(null);
  private showSettings$: Observable<boolean>;
  private _activeSlide$ = new BehaviorSubject(null);
  private _isFormDirty$ = new BehaviorSubject(false);

  public activeSlide$: Observable<TimelineViewSlideInterface>;
  public activeSlideDetail$: Observable<TimelineViewSlideInterface>;
  public slideList$: Observable<TimelineViewSlideInterface[]>;
  public settings$: Observable<TimelineSettingsInterface>;
  public isFormDirty$: Observable<boolean>;
  public activeSlideDetailCanSaveAsTitle$: Observable<boolean>;
  public errors$: Observable<Error>;

  // where does the eduContentId and eduContentMetadataId come from?
  // the component? DI?
  constructor(
    @Inject(EDITOR_HTTP_SERVICE_TOKEN)
    private editorHttpService: EditorHttpServiceInterface
  ) {
    this.initialise();
  }

  setHttpSettings(settings: EditorHttpSettingsInterface) {
    this.editorHttpService.setSettings(settings);
  }

  getTimeline(): Observable<TimelineConfigInterface> {
    return this.editorHttpService.getJson();
  }

  updateTimeline(data: TimelineConfigInterface): Observable<boolean> {
    return this.editorHttpService.setJson(data);
  }

  previewTimeline(): string {
    return this.editorHttpService.getPreviewUrl();
  }

  uploadFile(file: File): Observable<StorageInfoInterface> {
    return this.editorHttpService.uploadFile(file);
  }

  public openSettings() {
    if (!this.isSafeToNavigate()) return;

    this._activeSlide$.next(null);
    this.newSlide$.next(null);
    this._isFormDirty$.next(false);
  }

  public updateSettings(newSettings: TimelineSettingsInterface) {
    const data = { ...this.data$.value, ...newSettings };

    // Persist changes
    this.updateTimeline(data).subscribe(() => {
      this.data$.next(data);
    });
  }

  public createSlide() {
    if (!this.isSafeToNavigate()) return;

    const data = this.data$.value;

    this.newSlide$.next({
      type: data.title
        ? TIMELINE_SLIDE_TYPES.SLIDE
        : TIMELINE_SLIDE_TYPES.TITLE,
      label: 'Naamloos',
      viewSlide: {}
    });
    this._activeSlide$.next(null);
  }

  public upsertSlide(updatedSlide: TimelineViewSlideInterface) {
    const data = this.data$.value;
    const activeSlide = this._activeSlide$.value;

    // If it's an update and not an insert, delete what we had before this
    if (activeSlide) {
      this.deleteActiveSlide();
    }

    if (updatedSlide.type === TIMELINE_SLIDE_TYPES.TITLE) {
      data.title = updatedSlide.viewSlide;
    } else if (updatedSlide.type === TIMELINE_SLIDE_TYPES.SLIDE) {
      data.events.push(updatedSlide.viewSlide as TimelineSlideInterface);
    } else if (updatedSlide.type === TIMELINE_SLIDE_TYPES.ERA) {
      data.eras.push(updatedSlide.viewSlide as TimelineEraInterface);
    }

    // Persist changes
    this.updateTimeline(data).subscribe();

    // Nexting data causes the slideList to be updated
    this.data$.next(data);

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

    // Persist changes
    this.updateTimeline(data).subscribe();

    // Select nothing, since the previously active slide was deleted
    this._activeSlide$.next(null);

    this.data$.next(data);
  }

  public setActiveSlide(slide: TimelineViewSlideInterface) {
    if (!this.isSafeToNavigate()) return;

    this._activeSlide$.next(slide);
    this.newSlide$.next(null);
    this._isFormDirty$.next(false);
  }

  public setFormDirty(value: boolean) {
    this._isFormDirty$.next(value);
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
    this.setSourceStreams();
    this.setPresentationStreams();
  }

  private setSourceStreams() {
    this.editorHttpService.getJson().subscribe(timeline => {
      this.data$.next(timeline);
    });
  }

  private setPresentationStreams() {
    this.slideList$ = this.data$.pipe(
      filter(data => !!data),
      map(data =>
        this.mapToViewSlides(data.eras || [], data.events || [], data.title)
      ),
      shareReplay(1)
    );

    this.activeSlide$ = this._activeSlide$.asObservable();
    this.isFormDirty$ = this._isFormDirty$.asObservable();
    this.showSettings$ = this.showSettings();
    this.activeSlideDetail$ = this.getActiveSlideDetail();
    this.settings$ = this.getSettings();
    this.activeSlideDetailCanSaveAsTitle$ = this.getActiveSlideDetailCanSaveAsTitle();
    this.errors$ = this.editorHttpService.errors$;
  }

  private showSettings(): Observable<boolean> {
    return combineLatest([this.activeSlide$, this.newSlide$]).pipe(
      map(([activeSlide, newSlide]) => !activeSlide && !newSlide),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  private getActiveSlideDetailCanSaveAsTitle(): Observable<boolean> {
    return combineLatest([this.data$, this.activeSlideDetail$]).pipe(
      map(
        ([data, activeSlideDetail]) =>
          !data.title || data.title === activeSlideDetail.viewSlide
      )
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
      label:
        (era.text && era.text.headline) ||
        this.transformTimelineDateToLabel(era.start_date)
    }));

    const viewSlides = slides.map(slide => ({
      type: TIMELINE_SLIDE_TYPES.SLIDE,
      viewSlide: slide,
      label:
        slide.display_date ||
        this.transformTimelineDateToLabel(slide.start_date)
    }));

    const slideList = [...viewEras, ...viewSlides].sort((a, b) =>
      this.timelineViewSlideSorter(a, b)
    );

    if (title) {
      const viewTitle = {
        type: TIMELINE_SLIDE_TYPES.TITLE,
        viewSlide: title,
        label:
          title.display_date ||
          (title.start_date &&
            this.transformTimelineDateToLabel(title.start_date)) ||
          'Titel'
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

  private timelineViewSlideSorter(
    a: TimelineViewSlideInterface,
    b: TimelineViewSlideInterface
  ): number {
    const startDate_A = a.viewSlide.start_date;
    const startDate_B = b.viewSlide.start_date;

    if (startDate_A.year !== startDate_B.year)
      return startDate_A.year - startDate_B.year;
    if (startDate_A.month !== startDate_B.month)
      return (startDate_A.month || 0) - (startDate_B.month || 0);
    if (startDate_A.day !== startDate_B.day)
      return (startDate_A.day || 0) - (startDate_B.day || 0);
    if (startDate_A.hour !== startDate_B.hour)
      return (startDate_A.hour || 0) - (startDate_B.hour || 0);
    if (startDate_A.minute !== startDate_B.minute)
      return (startDate_A.minute || 0) - (startDate_B.minute || 0);
    if (startDate_A.second !== startDate_B.second)
      return (startDate_A.second || 0) - (startDate_B.second || 0);
    if (startDate_A.millisecond !== startDate_B.millisecond)
      return (startDate_A.millisecond || 0) - (startDate_B.millisecond || 0);
    if (a.type !== b.type) return a.type - b.type;
    return 0;
  }
}

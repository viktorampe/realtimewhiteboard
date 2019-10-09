import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import {
  combineLatest,
  filter,
  map,
  mapTo,
  shareReplay,
  switchMapTo
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

  // stores temporary value for new slide
  // always emit this in activeSlide when there is a value
  // emit null in setting$ when there is a value
  private newSlide$ = new BehaviorSubject<TimelineViewSlideInterface>(null);
  private showSettings$: Observable<boolean>;

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
    this.checkUnsavedChanges().subscribe(savedChanges => {
      if (savedChanges) {
        (this.activeSlide$ as BehaviorSubject<TimelineViewSlideInterface>).next(
          null
        );
        this.newSlide$.next(null);
      }
    });
  }

  public updateSettings(newSettings: TimelineSettingsInterface) {
    const data = this.data$.value;
    data.scale = newSettings.scale;
    data.options = newSettings.options;

    this.data$.next(data);
  }

  public createSlide(slideType: TIMELINE_SLIDE_TYPES) {
    this.checkUnsavedChanges().subscribe(savedChanges => {
      if (savedChanges) {
        let newSlide: TimelineSlideInterface | TimelineEraInterface = {};

        // Era type has some required properties whereas slide type has none
        if (slideType === TIMELINE_SLIDE_TYPES.ERA) {
          newSlide = {
            start_date: {
              year: 0
            },
            end_date: {
              year: 0
            }
          };
        }

        (this.activeSlide$ as BehaviorSubject<TimelineViewSlideInterface>).next(
          null
        );
        this.newSlide$.next({
          type: slideType,
          label: 'Naamloos',
          date: null,
          viewSlide: newSlide
        });
      }
    });
  }

  public upsertSlide(updatedSlide: TimelineViewSlideInterface) {
    this.activeSlide$.subscribe(activeSlide => {
      const data = this.data$.value;

      if (updatedSlide.type === TIMELINE_SLIDE_TYPES.TITLE) {
        data.title = updatedSlide.viewSlide;
      } else if (updatedSlide.type === TIMELINE_SLIDE_TYPES.SLIDE) {
        data.events.push(updatedSlide.viewSlide as TimelineSlideInterface);
      } else if (updatedSlide.type === TIMELINE_SLIDE_TYPES.ERA) {
        data.eras.push(updatedSlide.viewSlide as TimelineEraInterface);
      }

      // Nexting data causes the slideList to be updated
      this.data$.next(data);

      // Delete what we had before this
      this.deleteActiveSlide();

      // With the slideList updated, we can select the new active slide
      this.slideList$.subscribe(slideList => {
        const slideItem = slideList.find(
          slideListItem => slideListItem.viewSlide === updatedSlide.viewSlide
        );

        (this.activeSlide$ as BehaviorSubject<TimelineViewSlideInterface>).next(
          slideItem
        );
      });
    });
  }

  public deleteActiveSlide() {
    const data = this.data$.value;

    this.activeSlide$.subscribe(activeSlide => {
      if (activeSlide.type === TIMELINE_SLIDE_TYPES.TITLE) {
        data.title = null;
      } else if (activeSlide.type === TIMELINE_SLIDE_TYPES.SLIDE) {
        const foundEventIndex = data.events.findIndex(
          event => event === activeSlide.viewSlide
        );

        if (foundEventIndex !== -1) {
          data.events.splice(foundEventIndex, 1);
        }
      } else if (activeSlide.type === TIMELINE_SLIDE_TYPES.ERA) {
        const foundEraIndex = data.eras.findIndex(
          era => era === activeSlide.viewSlide
        );

        if (foundEraIndex !== -1) {
          data.eras.splice(foundEraIndex, 1);
        }
      }

      // Select nothing, since the previously active slide was deleted
      (this.activeSlide$ as BehaviorSubject<TimelineViewSlideInterface>).next(
        null
      );

      this.data$.next(data);
    });
  }

  public setActiveSlide(slide: TimelineViewSlideInterface) {
    this.checkUnsavedChanges().subscribe(savedChanges => {
      if (savedChanges) {
        (this.activeSlide$ as BehaviorSubject<TimelineViewSlideInterface>).next(
          slide
        );
      }
    });
  }

  /**
   * Returns true if it is safe to proceed. That means: the user has
   * no changes or the user has changes and just saved them.
   */
  private checkUnsavedChanges(): Observable<boolean> {
    return this.isFormDirty$.pipe(
      map(formDirty => {
        if (formDirty) {
          const mustSave = confirm(
            'Er zijn niet opgeslagen wijzigingen. Wijzigingen opslaan en doorgaan?'
          );

          if (mustSave) {
            //TODO: save current slide
          }

          return mustSave;
        } else {
          return true;
        }
      })
    );
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

    this.activeSlide$ = new BehaviorSubject<TimelineViewSlideInterface>(null);
    this.showSettings$ = this.showSettings();
    this.activeSlideDetail$ = this.getActiveSlideDetail();
    this.settings$ = this.getSettings();
    this.isFormDirty$ = new BehaviorSubject(false);
  }

  private showSettings() {
    return this.activeSlide$.pipe(
      combineLatest(this.newSlide$),
      map(([activeSlide, newSlide]) => !activeSlide && !newSlide),
      shareReplay(1)
    );
  }

  private getActiveSlideDetail(): Observable<TimelineViewSlideInterface> {
    const detailWithActiveSlide$ = this.activeSlide$.pipe(
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
}

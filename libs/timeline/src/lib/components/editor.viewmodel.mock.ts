import { Injectable } from '@angular/core';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TimelineConfigFixture } from '../+fixtures/timeline-config.fixture';
import {
  TimelineConfigInterface,
  TimelineSettingsInterface,
  TimelineViewSlideInterface,
  TIMELINE_SLIDE_TYPES
} from '../interfaces/timeline';
import {
  EditorHttpSettingsInterface,
  StorageInfoInterface
} from '../services/editor-http.service.interface';
import { EditorViewModel } from './editor.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockEditorViewModel
  implements ViewModelInterface<EditorViewModel> {
  public activeSlideDetail$ = new BehaviorSubject<TimelineViewSlideInterface>(
    this.getActiveSlideDetail()
  );
  public slideList$ = new BehaviorSubject<TimelineViewSlideInterface[]>(
    this.getSlideList()
  );
  public settings$ = new BehaviorSubject<TimelineSettingsInterface>(
    this.getSettings()
  );
  public isFormDirty$ = new BehaviorSubject<boolean>(false);
  public newSlide$ = new BehaviorSubject<TimelineViewSlideInterface>(null);
  public activeSlide$ = new BehaviorSubject<TimelineViewSlideInterface>(null);
  public activeSlideDetailCanSaveAsTitle$ = new BehaviorSubject<boolean>(true);

  setHttpSettings(): void {}
  openSettings(): EditorHttpSettingsInterface {
    return {
      apiBase: 'http://foo.bar',
      eduContentMetadataId: 1
    };
  }

  updateSettings(): void {}
  createSlide() {}
  upsertSlide() {}
  deleteActiveSlide() {}
  setActiveSlide() {}
  setFormDirty() {}

  getTimeline(): Observable<TimelineConfigInterface> {
    return of(null);
  }

  updateTimeline(data: TimelineConfigInterface): Observable<boolean> {
    return of(null);
  }

  previewTimeline(): string {
    return '';
  }

  uploadFile(file: File): Observable<StorageInfoInterface> {
    return of(null);
  }

  private getActiveSlideDetail(): TimelineViewSlideInterface {
    return this.getSlideList()[2];
  }

  private getSlideList(): TimelineViewSlideInterface[] {
    const slides = [1, 2, 3, 4, 5].map(key => ({
      type: TIMELINE_SLIDE_TYPES.SLIDE,
      viewSlide: {
        start_date: { year: 2019, month: key },
        text: {
          headline: 'Headline slide ' + key,
          text: 'Tekst van slide ' + key
        }
      },
      label: 'Slide ' + key,
      date: new Date(2019, key)
    }));

    const eras = [1, 4].map(key => ({
      type: TIMELINE_SLIDE_TYPES.ERA,
      viewSlide: {
        start_date: { year: 2019, month: key },
        end_date: { year: 2019, month: key + 2 },
        text: { headline: 'Headline era' + key, text: 'Tekst van era ' + key }
      },
      label: 'Era ' + key,
      date: new Date(2019, key)
    }));

    const title = {
      type: TIMELINE_SLIDE_TYPES.TITLE,
      viewSlide: this.getConfig().title,
      label: 'Title',
      date: null
    };

    return [
      title,
      eras[0],
      slides[0],
      slides[1],
      slides[2],
      eras[1],
      slides[3],
      slides[4]
    ];
  }

  private getSettings(): TimelineSettingsInterface {
    return {
      options: {
        relative: false,
        scale_factor: 1
      },
      scale: 'human'
    };
  }

  private getConfig(): TimelineConfigInterface {
    return new TimelineConfigFixture({
      title: {
        text: {
          headline: 'Dit is een titel.',
          text: 'Dit is de tekst van de titel'
        }
      }
    });
  }
}

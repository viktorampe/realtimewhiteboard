//file.only
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimelineConfigFixture } from '../+fixtures/timeline-config.fixture';
import { TimelineDateFixture } from '../+fixtures/timeline-date.fixture';
import { TimelineEraFixture } from '../+fixtures/timeline-era.fixture';
import { TimelineOptionsFixture } from '../+fixtures/timeline-options.fixture';
import { TimelineSlideFixture } from '../+fixtures/timeline-slide.fixture';
import { EDITOR_HTTP_SERVICE_TOKEN } from '../services/editor-http.service';
import { EditorHttpServiceInterface } from '../services/editor-http.service.interface';
import { TimelineTextFixture } from './../+fixtures/timeline-text.fixture';
import {
  TimelineConfigInterface,
  TimelineViewSlideInterface,
  TIMELINE_SLIDE_TYPES
} from './../interfaces/timeline';
import { EditorViewModel } from './editor.viewmodel';

describe('EditorViewModel', () => {
  let editorViewModel: EditorViewModel;
  let editorHttpService: EditorHttpServiceInterface;

  const timelineConfig: TimelineConfigInterface = new TimelineConfigFixture();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule, HttpClientModule],
      providers: [
        {
          provide: EDITOR_HTTP_SERVICE_TOKEN,
          useValue: {
            getJson: () => new BehaviorSubject(timelineConfig),
            setJson: () => {},
            getPreviewUrl: () => {},
            uploadFile: () => {}
          }
        }
      ]
    });
  });

  beforeEach(() => {
    editorViewModel = TestBed.get(EditorViewModel);
    editorHttpService = TestBed.get(EDITOR_HTTP_SERVICE_TOKEN);
  });

  it('should create', () => {
    expect(editorViewModel).toBeTruthy();
  });

  describe('handlers', () => {
    it('getTimeline() should call the editorHttpService.getJson', () => {
      jest.spyOn(editorHttpService, 'getJson');

      editorViewModel.getTimeline();
      expect(editorHttpService.getJson).toHaveBeenCalled();
    });

    it('setTimeline() should call the editorHttpService.setJson', () => {
      const data: TimelineConfigInterface = {
        events: [],
        eras: [],
        options: {}
      };
      jest.spyOn(editorHttpService, 'setJson');

      editorViewModel.updateTimeline(data);
      expect(editorHttpService.setJson).toHaveBeenCalledWith(data);
    });

    it('previewTimeline() should call the editorHttpService.getPreviewUrl', () => {
      jest.spyOn(editorHttpService, 'getPreviewUrl');

      editorViewModel.previewTimeline();
      expect(editorHttpService.getPreviewUrl).toHaveBeenCalledWith();
    });

    it('uploadFile() should call the editorHttpService.uploadFile', () => {
      const file: File = {} as File;

      jest.spyOn(editorHttpService, 'uploadFile');

      editorViewModel.uploadFile(file);
      expect(editorHttpService.uploadFile).toHaveBeenCalledWith(file);
    });
  });

  describe('presentation streams', () => {
    describe('slideList$', () => {
      it('should convert the timelineConfig and emit as a list', () => {
        timelineConfig.title = new TimelineSlideFixture({
          display_date: 'title_foo'
        });
        timelineConfig.eras = [
          new TimelineSlideFixture({
            text: new TimelineTextFixture({ headline: 'era_foo' })
          })
        ];
        timelineConfig.events = [
          new TimelineSlideFixture({ display_date: 'slide_foo' })
        ];

        const expected: TimelineViewSlideInterface[] = [
          {
            type: TIMELINE_SLIDE_TYPES.TITLE,
            viewSlide: timelineConfig.title,
            label: 'title_foo'
          },
          {
            type: TIMELINE_SLIDE_TYPES.ERA,
            viewSlide: timelineConfig.eras[0],
            label: 'era_foo'
          },
          {
            type: TIMELINE_SLIDE_TYPES.SLIDE,
            viewSlide: timelineConfig.events[0],
            label: 'slide_foo'
          }
        ];

        expect(editorViewModel.slideList$).toBeObservable(
          hot('a', { a: expected })
        );
      });

      describe('title', () => {
        it('should emit without a title', () => {
          timelineConfig.title = undefined;
          timelineConfig.eras = [
            new TimelineSlideFixture({
              text: new TimelineTextFixture({ headline: 'era_foo' })
            })
          ];
          timelineConfig.events = [
            new TimelineSlideFixture({ display_date: 'slide_foo' })
          ];

          const expected: TimelineViewSlideInterface[] = [
            {
              type: TIMELINE_SLIDE_TYPES.ERA,
              viewSlide: timelineConfig.eras[0],
              label: 'era_foo'
            },
            {
              type: TIMELINE_SLIDE_TYPES.SLIDE,
              viewSlide: timelineConfig.events[0],
              label: 'slide_foo'
            }
          ];

          expect(editorViewModel.slideList$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should use the correct label - display_date', () => {
          timelineConfig.title = new TimelineSlideFixture({
            display_date: 'title_foo'
          });
          timelineConfig.eras = [];
          timelineConfig.events = [];

          const expected: TimelineViewSlideInterface[] = [
            {
              type: TIMELINE_SLIDE_TYPES.TITLE,
              viewSlide: timelineConfig.title,
              label: 'title_foo'
            }
          ];

          expect(editorViewModel.slideList$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should use the correct label - start_date - display_date', () => {
          timelineConfig.title = new TimelineSlideFixture({
            display_date: undefined,
            start_date: new TimelineDateFixture({ display_date: 'title_foo' })
          });
          timelineConfig.eras = [];
          timelineConfig.events = [];

          const expected: TimelineViewSlideInterface[] = [
            {
              type: TIMELINE_SLIDE_TYPES.TITLE,
              viewSlide: timelineConfig.title,
              label: 'title_foo'
            }
          ];

          expect(editorViewModel.slideList$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should use the correct label - start_date', () => {
          timelineConfig.title = new TimelineSlideFixture({
            display_date: undefined,
            start_date: new TimelineDateFixture({
              display_date: undefined,
              year: 1,
              month: 2,
              day: 3,
              hour: 4,
              minute: 5,
              second: 6,
              millisecond: 7
            })
          });
          timelineConfig.eras = [];
          timelineConfig.events = [];

          const expected: TimelineViewSlideInterface[] = [
            {
              type: TIMELINE_SLIDE_TYPES.TITLE,
              viewSlide: timelineConfig.title,
              label: '3-2-1'
            }
          ];

          expect(editorViewModel.slideList$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should use the correct label - default', () => {
          timelineConfig.title = new TimelineSlideFixture({
            display_date: undefined,
            start_date: undefined
          });
          timelineConfig.eras = [];
          timelineConfig.events = [];

          const expected: TimelineViewSlideInterface[] = [
            {
              type: TIMELINE_SLIDE_TYPES.TITLE,
              viewSlide: timelineConfig.title,
              label: 'Titel'
            }
          ];

          expect(editorViewModel.slideList$).toBeObservable(
            hot('a', { a: expected })
          );
        });
      });

      describe('era', () => {
        it('should use the correct label - headline', () => {
          timelineConfig.title = undefined;
          timelineConfig.eras = [
            new TimelineEraFixture({
              text: new TimelineTextFixture({ headline: 'era_foo' })
            })
          ];
          timelineConfig.events = [];

          const expected: TimelineViewSlideInterface[] = [
            {
              type: TIMELINE_SLIDE_TYPES.ERA,
              viewSlide: timelineConfig.eras[0],
              label: 'era_foo'
            }
          ];

          expect(editorViewModel.slideList$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should use the correct label - start_date - display_date', () => {
          timelineConfig.title = undefined;
          timelineConfig.eras = [
            new TimelineEraFixture({
              text: undefined,
              start_date: new TimelineDateFixture({
                display_date: 'era_foo'
              })
            })
          ];
          timelineConfig.events = [];

          const expected: TimelineViewSlideInterface[] = [
            {
              type: TIMELINE_SLIDE_TYPES.ERA,
              viewSlide: timelineConfig.eras[0],
              label: 'era_foo'
            }
          ];

          expect(editorViewModel.slideList$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should use the correct label - start_date', () => {
          timelineConfig.title = undefined;
          timelineConfig.eras = [
            new TimelineEraFixture({
              text: undefined,
              start_date: new TimelineDateFixture({
                display_date: undefined,
                year: 1,
                month: 2,
                day: 3,
                hour: 4,
                minute: 5,
                second: 6,
                millisecond: 7
              })
            })
          ];
          timelineConfig.events = [];

          const expected: TimelineViewSlideInterface[] = [
            {
              type: TIMELINE_SLIDE_TYPES.ERA,
              viewSlide: timelineConfig.eras[0],
              label: '3-2-1'
            }
          ];

          expect(editorViewModel.slideList$).toBeObservable(
            hot('a', { a: expected })
          );
        });
      });

      describe('event', () => {
        it('should use the correct label - display_date', () => {
          timelineConfig.title = undefined;
          timelineConfig.eras = [];
          timelineConfig.events = [
            new TimelineSlideFixture({
              display_date: 'slide_foo'
            })
          ];

          const expected: TimelineViewSlideInterface[] = [
            {
              type: TIMELINE_SLIDE_TYPES.SLIDE,
              viewSlide: timelineConfig.events[0],
              label: 'slide_foo'
            }
          ];

          expect(editorViewModel.slideList$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should use the correct label - start_date - display_date', () => {
          timelineConfig.title = undefined;
          timelineConfig.eras = [];
          timelineConfig.events = [
            new TimelineSlideFixture({
              display_date: undefined,
              start_date: new TimelineDateFixture({ display_date: 'slide_foo' })
            })
          ];

          const expected: TimelineViewSlideInterface[] = [
            {
              type: TIMELINE_SLIDE_TYPES.SLIDE,
              viewSlide: timelineConfig.events[0],
              label: 'slide_foo'
            }
          ];

          expect(editorViewModel.slideList$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should use the correct label - start_date (mm-yyyy)', () => {
          timelineConfig.title = undefined;
          timelineConfig.eras = [];
          timelineConfig.events = [
            new TimelineSlideFixture({
              display_date: undefined,
              start_date: new TimelineDateFixture({
                display_date: undefined,
                year: 1,
                month: 2,
                day: undefined
              })
            })
          ];

          const expected: TimelineViewSlideInterface[] = [
            {
              type: TIMELINE_SLIDE_TYPES.SLIDE,
              viewSlide: timelineConfig.events[0],
              label: '2-1'
            }
          ];

          expect(editorViewModel.slideList$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should use the correct label - start_date (yyyy)', () => {
          timelineConfig.title = undefined;
          timelineConfig.eras = [];
          timelineConfig.events = [
            new TimelineSlideFixture({
              display_date: undefined,
              start_date: new TimelineDateFixture({
                display_date: undefined,
                year: 1,
                month: undefined,
                day: undefined
              })
            })
          ];

          const expected: TimelineViewSlideInterface[] = [
            {
              type: TIMELINE_SLIDE_TYPES.SLIDE,
              viewSlide: timelineConfig.events[0],
              label: '1'
            }
          ];

          expect(editorViewModel.slideList$).toBeObservable(
            hot('a', { a: expected })
          );
        });
      });

      describe('sorting', () => {
        it('should sort the the eras and events by start_date', () => {
          timelineConfig.title = undefined;
          timelineConfig.eras = [
            new TimelineSlideFixture({
              text: new TimelineTextFixture({ headline: 'era_1' }),
              start_date: { year: 0 }
            }),
            new TimelineSlideFixture({
              text: new TimelineTextFixture({ headline: 'era_2' }),
              start_date: {
                year: 1,
                month: 1,
                day: 1,
                hour: 1
              }
            }),
            new TimelineSlideFixture({
              text: new TimelineTextFixture({ headline: 'era_3' }),
              start_date: { year: 1, month: 1 }
            })
          ];
          timelineConfig.events = [
            new TimelineSlideFixture({
              display_date: 'event_1',
              start_date: { year: 0, month: 1 }
            }),
            new TimelineSlideFixture({
              display_date: 'event_2',
              start_date: { year: 0, month: 1, day: 1 }
            }),
            new TimelineSlideFixture({
              display_date: 'event_3',
              start_date: { year: 1, month: 1, day: 1 }
            }),
            new TimelineSlideFixture({
              display_date: 'event_4',
              start_date: {
                year: 1,
                month: 1,
                day: 1,
                hour: 2
              }
            }),
            new TimelineSlideFixture({
              display_date: 'event_5',
              start_date: {
                year: 1,
                month: 1,
                day: 1,
                hour: 2,
                minute: 1
              }
            }),
            new TimelineSlideFixture({
              display_date: 'event_6',
              start_date: {
                year: 1,
                second: 1,
                millisecond: 1
              }
            }),
            new TimelineSlideFixture({
              display_date: 'event_7',
              start_date: {
                year: 1,
                second: 1
              }
            }),
            new TimelineSlideFixture({
              display_date: 'event_8',
              start_date: {
                year: 1,
                millisecond: 1
              }
            })
          ];

          // comparing label order
          const expected: string[] = [
            'era_1',
            'event_1',
            'event_2',
            'event_8',
            'event_7',
            'event_6',
            'era_3',
            'event_3',
            'era_2',
            'event_4',
            'event_5'
          ];

          expect(
            editorViewModel.slideList$.pipe(
              map(slides => slides.map(slide => slide.label))
            )
          ).toBeObservable(hot('a', { a: expected }));
        });

        it('should sort a title, eras and events with equal start_dates', () => {
          timelineConfig.title = new TimelineSlideFixture({
            display_date: 'title_1',
            start_date: { year: 0 }
          });
          timelineConfig.eras = [
            new TimelineSlideFixture({
              text: new TimelineTextFixture({ headline: 'era_1' }),
              start_date: { year: 0 }
            })
          ];
          timelineConfig.events = [
            new TimelineSlideFixture({
              display_date: 'event_1',
              start_date: { year: 0 }
            })
          ];

          // comparing label order
          const expected: string[] = ['title_1', 'era_1', 'event_1'];

          expect(
            editorViewModel.slideList$.pipe(
              map(slides => slides.map(slide => slide.label))
            )
          ).toBeObservable(hot('a', { a: expected }));
        });
      });
    });

    describe('activeSlide$', () => {
      it('should contain the set value', () => {
        expect(editorViewModel.activeSlide$).toBeObservable(
          hot('a', { a: null })
        );

        const mockTimelineSlide = {
          label: 'foo',
          viewSlide: new TimelineSlideFixture(),
          type: 3
        };
        editorViewModel.setActiveSlide(mockTimelineSlide);
        expect(editorViewModel.activeSlide$).toBeObservable(
          hot('a', { a: mockTimelineSlide })
        );
      });
    });

    describe('isFormDirty$', () => {
      it('should contain the set value', () => {
        expect(editorViewModel.isFormDirty$).toBeObservable(
          hot('a', { a: false })
        );

        editorViewModel.setFormDirty(true);
        expect(editorViewModel.isFormDirty$).toBeObservable(
          hot('a', { a: true })
        );
      });
    });

    describe('settings$', () => {
      beforeEach(() => {
        timelineConfig.scale = 'cosmological';
        timelineConfig.options = new TimelineOptionsFixture({
          scale_factor: 123,
          relative: true
        });
      });

      it('should contain the timelineConfig settings', () => {
        expect(editorViewModel.settings$).toBeObservable(
          hot('a', {
            a: {
              scale: timelineConfig.scale,
              options: timelineConfig.options
            }
          })
        );
      });

      it('should not contain a value when there is an active slide', () => {
        editorViewModel.setActiveSlide({} as any);

        expect(editorViewModel.settings$).toBeObservable(
          hot('a', {
            a: null
          })
        );
      });

      it('should not contain a value when there is a newly created slide', () => {
        editorViewModel.createSlide();

        expect(editorViewModel.settings$).toBeObservable(
          hot('a', {
            a: null
          })
        );
      });

      it('should contain the value after openSettings is called', () => {
        editorViewModel.setActiveSlide({} as any);

        editorViewModel.openSettings();

        expect(editorViewModel.settings$).toBeObservable(
          hot('a', {
            a: {
              scale: timelineConfig.scale,
              options: timelineConfig.options
            }
          })
        );
      });
    });

    describe('activeSlideDetail$', () => {
      it('should contain a clone of the activeSlide', () => {
        const mockTimelineSlide = {
          label: 'foo',
          viewSlide: new TimelineSlideFixture(),
          type: 3
        };

        let value;
        editorViewModel.activeSlideDetail$.subscribe(slide => (value = slide));
        editorViewModel.setActiveSlide(mockTimelineSlide);

        expect(value).toEqual(mockTimelineSlide);
        expect(value).not.toBe(mockTimelineSlide);
      });

      it('should contain a new slide', () => {
        const mockTimelineSlide = {
          label: 'foo',
          viewSlide: new TimelineSlideFixture(),
          type: 3
        };

        editorViewModel.setActiveSlide(mockTimelineSlide);
        editorViewModel.createSlide();

        expect(editorViewModel.activeSlideDetail$).toBeObservable(
          hot('a', {
            a: {
              type: 3,
              viewSlide: {},
              label: 'Naamloos'
            }
          })
        );
      });

      it('should not contain a value if settings are shown', () => {
        editorViewModel.createSlide();
        editorViewModel.openSettings();

        expect(editorViewModel.activeSlideDetail$).toBeObservable(
          hot('a', {
            a: null
          })
        );
      });
    });

    describe('activeSlideDetailCanSaveAsTitle$', () => {
      it('should contain true is there is no title', () => {
        timelineConfig.title = undefined;

        expect(editorViewModel.activeSlideDetailCanSaveAsTitle$).toBeObservable(
          hot('a', { a: true })
        );
      });

      it('should contain true is the active slide is the title slide', () => {
        const mockTimelineTitleSlide = new TimelineSlideFixture({
          display_date: 'foo'
        });

        timelineConfig.title = mockTimelineTitleSlide;
        editorViewModel.setActiveSlide({
          viewSlide: mockTimelineTitleSlide,
          label: '',
          type: 1
        });

        expect(editorViewModel.activeSlideDetailCanSaveAsTitle$).toBeObservable(
          hot('a', { a: true })
        );
      });

      it('should contain false is the active slide is not the title slide', () => {
        const mockTimelineTitleSlide = new TimelineSlideFixture({
          display_date: 'foo'
        });

        timelineConfig.title = mockTimelineTitleSlide;
        editorViewModel.setActiveSlide({
          viewSlide: new TimelineSlideFixture({
            display_date: 'bar'
          }),
          label: '',
          type: 3
        });

        expect(editorViewModel.activeSlideDetailCanSaveAsTitle$).toBeObservable(
          hot('a', { a: false })
        );
      });
    });
  });
});

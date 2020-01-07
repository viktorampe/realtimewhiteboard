import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { hot } from '@nrwl/angular/testing';
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
  TimelineSettingsInterface,
  TimelineViewSlideInterface,
  TIMELINE_SLIDE_TYPES
} from './../interfaces/timeline';
import { EditorViewModel } from './editor.viewmodel';

describe('EditorViewModel', () => {
  let editorViewModel: EditorViewModel;
  let editorHttpService: EditorHttpServiceInterface;

  const timelineConfig: TimelineConfigInterface = new TimelineConfigFixture({
    scale: 'cosmological',
    options: new TimelineOptionsFixture({
      scale_factor: 789,
      relative: true
    })
  });

  const mockViewSlide: TimelineViewSlideInterface = {
    label: 'valentijn',
    type: TIMELINE_SLIDE_TYPES.SLIDE,
    viewSlide: new TimelineSlideFixture()
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule, HttpClientModule],
      providers: [
        {
          provide: EDITOR_HTTP_SERVICE_TOKEN,
          useValue: {
            setSettings: () => {},
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

    editorViewModel.loadTimeline();
  });

  afterEach(() => {
    timelineConfig.title = undefined;
    timelineConfig.eras = [];
    timelineConfig.events = [];
    timelineConfig.scale = 'cosmological';
    timelineConfig.options = new TimelineOptionsFixture({
      scale_factor: 789,
      relative: true
    });
  });

  it('should create', () => {
    expect(editorViewModel).toBeTruthy();
  });

  describe('http handlers', () => {
    describe('setHttpSettings()', () => {
      const mockHttpSettings = { apiBase: 'foo', eduContentMetadataId: 123 };

      it('should call editorHttpService.setSettings', () => {
        jest.spyOn(editorHttpService, 'setSettings');

        editorViewModel.setHttpSettings(mockHttpSettings);
        expect(editorHttpService.setSettings).toHaveBeenCalledWith(
          mockHttpSettings
        );
      });

      it('should call loadTimeline', () => {
        jest.spyOn(editorViewModel, 'loadTimeline');

        editorViewModel.setHttpSettings(mockHttpSettings);
        expect(editorViewModel.loadTimeline).toHaveBeenCalled();
      });
    });

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

    describe('openSettings$', () => {
      it('should emit false when an active slide is set, while true', () => {
        editorViewModel.openSettings();
        editorViewModel.setActiveSlide(mockViewSlide);

        expect(editorViewModel.showSettings$).toBeObservable(
          hot('a', { a: false })
        );
      });

      it('should emit false when a new slide is created, while true', () => {
        editorViewModel.openSettings();
        editorViewModel.createSlide();

        expect(editorViewModel.showSettings$).toBeObservable(
          hot('a', { a: false })
        );
      });

      it('should emit true when openSettings is called', () => {
        editorViewModel.createSlide();
        editorViewModel.openSettings();

        expect(editorViewModel.showSettings$).toBeObservable(
          hot('a', { a: true })
        );
      });

      it('should not emit if the value does not change', () => {
        const emits = [];
        editorViewModel.showSettings$.subscribe(value => emits.push(value));

        editorViewModel.createSlide();
        editorViewModel.setActiveSlide(mockViewSlide);
        editorViewModel.openSettings();

        // initial value === true, is first value in array
        expect(emits).toEqual([true, false, true]);
      });
    });

    describe('settings$', () => {
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
              type: 1,
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

  describe('methods', () => {
    describe('openSettings', () => {
      let isSafeToNavigateSpy: jest.SpyInstance;
      beforeEach(() => {
        // private, will test separately later
        isSafeToNavigateSpy = editorViewModel['isSafeToNavigate'] = jest.fn();
      });

      it('should check if it is safe to navigate', () => {
        editorViewModel.openSettings();
        expect(isSafeToNavigateSpy).toHaveBeenCalled();
      });

      it('should reset activeSlide$', () => {
        isSafeToNavigateSpy.mockReturnValue(true);
        editorViewModel.setActiveSlide(mockViewSlide);
        editorViewModel.openSettings();

        expect(editorViewModel.activeSlide$).toBeObservable(
          hot('a', { a: null })
        );
      });

      it('should reset activeSlideDetail$', () => {
        isSafeToNavigateSpy.mockReturnValue(true);
        editorViewModel.setActiveSlide(mockViewSlide);
        editorViewModel.openSettings();

        expect(editorViewModel.activeSlideDetail$).toBeObservable(
          hot('a', { a: null })
        );
      });

      it('should reset isFormDirty$', () => {
        isSafeToNavigateSpy.mockReturnValue(true);
        editorViewModel.setFormDirty(true);
        editorViewModel.openSettings();

        expect(editorViewModel.isFormDirty$).toBeObservable(
          hot('a', { a: false })
        );
      });
    });

    describe('updateSettings', () => {
      beforeEach(() => {
        editorHttpService.setJson = jest.fn(() => hot('a|', { a: true }));
      });

      it('should trigger an emit with the new settings', () => {
        const mockSettings: TimelineSettingsInterface = {
          scale: 'human',
          options: new TimelineOptionsFixture({
            scale_factor: 456,
            relative: true
          })
        };

        const intialSettings = {
          scale: timelineConfig.scale,
          options: timelineConfig.options
        };

        editorViewModel.updateSettings(mockSettings);

        expect(editorViewModel.settings$).toBeObservable(
          hot('(ab)', { a: intialSettings, b: mockSettings })
        );
      });
    });

    describe('createSlide', () => {
      let isSafeToNavigateSpy: jest.SpyInstance;
      beforeEach(() => {
        // private, will test separately later
        isSafeToNavigateSpy = editorViewModel[
          'isSafeToNavigate'
        ] = jest.fn().mockReturnValue(true);
      });

      it('should check if it is safe to navigate', () => {
        editorViewModel.createSlide();
        expect(isSafeToNavigateSpy).toHaveBeenCalled();
      });

      it('should emit a new slide - title', () => {
        editorViewModel.createSlide();

        const expected = { label: 'Naamloos', type: 1, viewSlide: {} };
        expect(editorViewModel.activeSlideDetail$).toBeObservable(
          hot('a', { a: expected })
        );
      });

      it('should emit a new slide - slide', () => {
        timelineConfig.title = mockViewSlide.viewSlide;
        editorViewModel.createSlide();

        const expected = { label: 'Naamloos', type: 3, viewSlide: {} };
        expect(editorViewModel.activeSlideDetail$).toBeObservable(
          hot('a', { a: expected })
        );
      });
    });

    describe('upsertSlide', () => {
      beforeEach(() => {
        editorHttpService.setJson = jest.fn(() => hot('a|', { a: true }));
      });

      it('should update the timeline - slide', () => {
        const newTimelineConfig = {
          events: [mockViewSlide.viewSlide],
          eras: [],
          title: timelineConfig.title,
          scale: timelineConfig.scale,
          options: timelineConfig.options
        };

        editorViewModel.upsertSlide(mockViewSlide);
        expect(editorHttpService.setJson).toHaveBeenCalledWith(
          newTimelineConfig
        );

        const expected = [mockViewSlide];
        expect(editorViewModel.slideList$).toBeObservable(
          hot('a', { a: expected })
        );
      });

      it('should update the timeline - era', () => {
        const mockViewSlideEra = {
          ...mockViewSlide,
          type: 2,
          label: 'foo'
        };

        const newTimelineConfig = {
          events: [],
          eras: [mockViewSlideEra.viewSlide],
          title: timelineConfig.title,
          scale: timelineConfig.scale,
          options: timelineConfig.options
        };

        editorViewModel.upsertSlide(mockViewSlideEra);
        expect(editorHttpService.setJson).toHaveBeenCalledWith(
          newTimelineConfig
        );

        const expected = [mockViewSlideEra];
        expect(editorViewModel.slideList$).toBeObservable(
          hot('a', { a: expected })
        );
      });

      it('should update the timeline - title', () => {
        const mockViewSlideTitle = {
          ...mockViewSlide,
          type: 1
        };

        const newTimelineConfig = {
          events: [],
          eras: [],
          title: mockViewSlideTitle.viewSlide,
          scale: timelineConfig.scale,
          options: timelineConfig.options
        };

        editorViewModel.upsertSlide(mockViewSlideTitle);
        expect(editorHttpService.setJson).toHaveBeenCalledWith(
          newTimelineConfig
        );

        const expected = [mockViewSlideTitle];
        expect(editorViewModel.slideList$).toBeObservable(
          hot('a', { a: expected })
        );
      });

      it('should replace the active slide', () => {
        const activeSlideEmits = [];
        editorViewModel.activeSlide$.subscribe(emit =>
          activeSlideEmits.push(emit)
        );

        // save new
        editorViewModel.upsertSlide(mockViewSlide);

        // update existing
        const updatedViewSlide = {
          ...mockViewSlide,
          label: 'updated value',
          viewSlide: {
            ...mockViewSlide.viewSlide,
            start_date: {
              ...mockViewSlide.viewSlide.start_date,
              display_date: 'updated value'
            }
          }
        };
        editorViewModel.upsertSlide(updatedViewSlide);

        expect(activeSlideEmits).toEqual([
          null, // initual value
          mockViewSlide, // first upsert
          null, // remove old value
          updatedViewSlide // second upsert
        ]);

        // slidelist should only contain updated value
        expect(editorViewModel.slideList$).toBeObservable(
          hot('a', { a: [updatedViewSlide] })
        );
      });
    });

    describe('deleteActiveSlide', () => {
      beforeEach(() => {
        editorHttpService.setJson = jest.fn(() => hot('a|', { a: true }));
        timelineConfig.events = [mockViewSlide.viewSlide];
        editorViewModel.setActiveSlide(mockViewSlide);
      });

      it('should update the timeline', () => {
        const newTimelineConfig = {
          events: [],
          eras: [],
          title: timelineConfig.title,
          scale: timelineConfig.scale,
          options: timelineConfig.options
        };

        editorViewModel.deleteActiveSlide();
        expect(editorHttpService.setJson).toHaveBeenCalledWith(
          newTimelineConfig
        );

        const expected = [];
        expect(editorViewModel.slideList$).toBeObservable(
          hot('a', { a: expected })
        );
      });

      it('should replace the active slide', () => {
        editorViewModel.deleteActiveSlide();

        // slidelist should only contain updated value
        expect(editorViewModel.activeSlide$).toBeObservable(
          hot('a', { a: null })
        );
      });
    });

    describe('isSafeToNavigate', () => {
      // I know it's private, but I stubbed it for the tests earlier

      it('should ask for confirmation if the form is dirty', () => {
        window.confirm = jest.fn().mockReturnValue(false);

        editorViewModel.setFormDirty(true);
        const response = editorViewModel['isSafeToNavigate']();

        expect(window.confirm).toHaveBeenCalledWith(
          'Let op! Er zijn niet opgeslagen wijzigingen. Doorgaan zonder wijzigingen op te slaan?'
        );
        expect(response).toBe(false);
      });

      it('should not as for confirmation if the form is not dirty', () => {
        window.confirm = jest.fn().mockReturnValue(false);

        editorViewModel.setFormDirty(false);
        const response = editorViewModel['isSafeToNavigate']();

        expect(window.confirm).not.toHaveBeenCalled();
        expect(response).toBe(true);
      });
    });
  });
});

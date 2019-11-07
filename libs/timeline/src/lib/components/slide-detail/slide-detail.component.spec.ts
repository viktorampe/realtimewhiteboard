import { SimpleChange } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatRadioButton,
  MatRadioModule,
  MatStepperModule,
  MatTooltipModule
} from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { configureTestSuite } from 'ng-bullet';
import { TimelineSlideFixture } from '../../+fixtures/timeline-slide.fixture';
import {
  TimelineEraInterface,
  TimelineSlideInterface,
  TimelineViewSlideInterface,
  TIMELINE_SLIDE_TYPES
} from '../../interfaces/timeline';
import { EditorViewModel } from '../editor.viewmodel';
import { MockEditorViewModel } from '../editor.viewmodel.mock';
import {
  FileUploadResult,
  SlideDetailComponent
} from './slide-detail.component';

describe('SlideDetailComponent', () => {
  let component: SlideDetailComponent;
  let fixture: ComponentFixture<SlideDetailComponent>;
  const viewSlideMock: TimelineViewSlideInterface = {
    type: TIMELINE_SLIDE_TYPES.SLIDE,
    viewSlide: new TimelineSlideFixture({ group: 'foo group' }),
    label: 'foo'
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatListModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatStepperModule,
        MatIconModule,
        MatTooltipModule,
        NoopAnimationsModule
      ],
      declarations: [SlideDetailComponent],
      providers: [
        {
          provide: EditorViewModel,
          useClass: MockEditorViewModel
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideDetailComponent);
    component = fixture.componentInstance;
    component.viewSlide = viewSlideMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the streams and properties', () => {
    expect(component.slideForm).toBeDefined();
    expect(component.chosenType$).toBeDefined();
    expect(component.isDirty).toBeDefined();
    expect(component.slideTypes).toBeDefined();
    expect(component.tooltips).toBeDefined();
  });

  it('should initialize tooltips', () => {
    expect(Object.keys(component.tooltips)).toEqual([
      'type',
      'group',
      'display_date',
      'start_date',
      'end_date',
      'headline',
      'text',
      'background',
      'color',
      'url',
      'thumbnail',
      'caption',
      'label',
      'credit',
      'alt',
      'title',
      'link'
    ]);
  });

  it('should have slideTypes with labels', () => {
    const expectedMap = {
      [TIMELINE_SLIDE_TYPES.TITLE]: 'titel',
      [TIMELINE_SLIDE_TYPES.ERA]: 'tijdspanne',
      [TIMELINE_SLIDE_TYPES.SLIDE]: 'gebeurtenis'
    };

    const slideTypeLabelMap = component.slideTypes.reduce((acc, type) => {
      return { ...acc, [type.value]: type.label };
    }, {});

    expect(slideTypeLabelMap).toEqual(expectedMap);
  });

  it('should have a radiobutton for each slide type', () => {
    const formSectionDE = fixture.debugElement.query(
      By.css('.timeline-slide-detail__form__section')
    );
    const radioButtonsDE = formSectionDE.queryAll(By.directive(MatRadioButton));

    expect(radioButtonsDE.length).toBe(component.slideTypes.length);
  });

  describe('mapping viewslide data to  form data', () => {
    const testCases = [
      {
        viewSlide: {
          type: TIMELINE_SLIDE_TYPES.SLIDE,
          viewSlide: {
            start_date: {
              year: 0, // deliberately put to the value 0
              month: null, // is not set
              day: 2, // deliberately set to the value 2
              hour: 0, // deliberately put to the value 0
              display_date: 'foo start'
            }
          },
          label: 'foo label'
        },
        expected: {
          year: 0,
          month: null,
          day: 2,
          hour: 0,
          minute: null,
          second: null,
          millisecond: null,
          display_date: 'foo start'
        }
      },
      {
        viewSlide: {
          type: TIMELINE_SLIDE_TYPES.SLIDE,
          viewSlide: {
            start_date: {
              year: 0,
              month: 0,
              day: 0,
              hour: 0,
              minute: 0,
              second: 0,
              millisecond: 0,
              display_date: 'all 0 values'
            }
          },
          label: 'foo label'
        },
        expected: {
          year: 0,
          month: null,
          day: 0,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
          display_date: 'all 0 values'
        }
      },
      {
        viewSlide: {
          type: TIMELINE_SLIDE_TYPES.SLIDE,
          viewSlide: {
            start_date: null
          },
          label: 'foo label'
        },
        expected: {
          year: null,
          month: null,
          day: 0,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
          display_date: 'all 0 values'
        }
      }
    ];

    it('should map the viewSlide date values to the correct form date values', () => {
      testCases.forEach(testCase => {
        component.viewSlide = testCase.viewSlide as TimelineViewSlideInterface;

        component.ngOnChanges({
          viewSlide: new SimpleChange(null, testCase.viewSlide, false)
        });
        expect(component.slideForm.value.start_date).toEqual(testCase.expected);
      });
    });
  });

  describe('validation', () => {
    describe('updateValidatorsForType()', () => {
      let typeControl: AbstractControl;
      let start_dateYearControl: AbstractControl;
      let end_dateYearControl: AbstractControl;

      beforeEach(() => {
        typeControl = component.slideForm.get('general.type');
        start_dateYearControl = component.slideForm.get('start_date.year');
        end_dateYearControl = component.slideForm.get('end_date.year');

        // there is no offical way to get current validators of the form control
        // workaround: make the formControl invalid and check if the expected validator errorCode is present
        start_dateYearControl.setValue('');
        start_dateYearControl.updateValueAndValidity();
        end_dateYearControl.setValue('');
        end_dateYearControl.updateValueAndValidity();
      });

      it('should update validators for type era', () => {
        typeControl.setValue(TIMELINE_SLIDE_TYPES.ERA);
        expect(start_dateYearControl.getError('required')).toBe(true);
        expect(end_dateYearControl.getError('required')).toEqual(true);

        expect(component.requiredFieldsMap['start_date.year']).toBe(true);
        expect(component.requiredFieldsMap['end_date.year']).toBe(true);
      });

      it('should update validators for type slide', () => {
        typeControl.setValue(TIMELINE_SLIDE_TYPES.SLIDE);
        expect(start_dateYearControl.getError('required')).toEqual(true);
        expect(end_dateYearControl.getError('required')).toEqual(null); // optional when slide

        expect(component.requiredFieldsMap['start_date.year']).toBe(true);
        expect(component.requiredFieldsMap['end_date.year']).toBe(false);
      });

      it('should update validators for type title', () => {
        typeControl.setValue(TIMELINE_SLIDE_TYPES.TITLE);
        expect(start_dateYearControl.getError('required')).toEqual(null); // optional when title
        expect(end_dateYearControl.getError('required')).toEqual(null); // optional when slide

        expect(component.requiredFieldsMap['start_date.year']).toBe(false);
        expect(component.requiredFieldsMap['end_date.year']).toBe(false);
      });
    });
  });

  describe('inputs', () => {
    describe('fileUploadResult', () => {
      it('should set the value of the correct formControl', () => {
        const mockUploadResult: FileUploadResult = {
          formControlName: 'background.url',
          url: 'www.foo.url'
        };

        component.ngOnChanges({
          fileUploadResult: new SimpleChange(null, mockUploadResult, false)
        });

        expect(component.slideForm.get('background.url').value).toBe(
          'www.foo.url'
        );
        // make sure the other url's aren't accidentally set
        expect(component.slideForm.get('media.url').value).toBe('');
        expect(component.slideForm.get('media.thumbnail').value).toBe('');
      });
    });

    describe('canBeSavedAsTitle', () => {
      it('should disable title radio-button if canBeSavedAsTitle is set to false', () => {
        component.canBeSavedAsTitle = false;
        fixture.detectChanges();

        const formSectionDE = fixture.debugElement.query(
          By.css('.timeline-slide-detail__form__section')
        );
        const radioButtonsDE = formSectionDE.queryAll(
          By.directive(MatRadioButton)
        );
        const radioButtons = radioButtonsDE.map(
          rb => rb.componentInstance as MatRadioButton
        );
        radioButtons.forEach(rb => {
          // Only title should be disabled
          expect(rb.disabled).toBe(rb.value === TIMELINE_SLIDE_TYPES.TITLE);
        });
      });
    });
  });

  describe('handleFileInput()', () => {
    let uploadFileSpy: jest.SpyInstance;

    beforeEach(() => {
      uploadFileSpy = jest.spyOn(component.uploadFile, 'emit');
    });

    it('should emit the correct data', () => {
      const fileOne = new File(['I am file one'], 'foo');
      const fileList: FileList = {
        length: 1,
        0: fileOne,
        item: () => fileOne
      };

      component.handleFileInput(fileList, 'media.url');

      expect(uploadFileSpy).toHaveBeenCalled();
      expect(uploadFileSpy).toHaveBeenCalledTimes(1);
      expect(uploadFileSpy).toHaveBeenCalledWith({
        file: fileOne,
        formControlName: 'media.url'
      });
    });
  });

  describe('handleColorPick()', () => {
    it('should set the value of the background color formcontrol to the picked color', () => {
      component.handleColorPick('fooColor');
      expect(component.slideForm.get('background.color').value).toBe(
        'fooColor'
      );
    });
  });

  describe('goBack()', () => {
    it('should call stepper.previous()', () => {
      jest.spyOn(component.stepper, 'previous');
      component.goBack();
      expect(component.stepper.previous).toHaveBeenCalledTimes(1);
    });
  });

  describe('goForward()', () => {
    it('should call stepper.next()', () => {
      jest.spyOn(component.stepper, 'next');
      component.goForward();
      expect(component.stepper.next).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSubmit()', () => {
    let saveViewSlideSpy: jest.SpyInstance;

    beforeEach(() => {
      saveViewSlideSpy = jest.spyOn(component.saveViewSlide, 'emit');
    });

    describe('when valid', () => {
      beforeEach(() => {
        component.slideForm.setErrors(null); // make the form valid
        component.slideForm.updateValueAndValidity(); // make sure the form knows it's valid
      });

      it('should trigger the saveViewSlide output when the form data is valid', () => {
        component.onSubmit();
        expect(saveViewSlideSpy).toHaveBeenCalled();
        expect(saveViewSlideSpy).toHaveBeenCalledTimes(1);
      });

      it('should emit the updated viewSlide data of type slide', () => {
        const mockViewSlide = {
          type: TIMELINE_SLIDE_TYPES.SLIDE,
          viewSlide: {
            start_date: {
              year: 1,
              month: 2,
              day: 3,
              display_date: 'foo start'
            },
            end_date: {
              year: 2,
              month: 3,
              day: 4,
              display_date: 'foo end'
            },
            group: 'foo group',
            text: {
              text: 'foo text',
              headline: 'foo headline'
            },
            background: { color: 'foo color' }
          } as TimelineSlideInterface,
          label: 'foo label'
        };

        component.viewSlide = mockViewSlide; // needed because the input value won't be changed by triggering ngOnChanges!
        component.ngOnChanges({
          viewSlide: new SimpleChange(null, mockViewSlide, false)
        });

        component.onSubmit();

        const expectedOutput: TimelineViewSlideInterface = {
          type: TIMELINE_SLIDE_TYPES.SLIDE,
          viewSlide: {
            start_date: {
              year: 1,
              month: 2,
              day: 3,
              display_date: 'foo start'
            },
            end_date: {
              year: 2,
              month: 3,
              day: 4,
              display_date: 'foo end'
            },
            group: 'foo group',
            text: {
              text: 'foo text',
              headline: 'foo headline'
            },
            background: {
              color: 'foo color'
            }
          },
          label: 'foo label'
        };

        expect(saveViewSlideSpy).toHaveBeenCalledWith(expectedOutput);
      });

      it('should emit the updated viewSlide data of type title', () => {
        const mockViewSlide = {
          type: TIMELINE_SLIDE_TYPES.TITLE,
          viewSlide: {
            start_date: {
              year: 1,
              month: 2,
              day: 3,
              display_date: 'title start'
            },
            end_date: {
              year: 2,
              month: 3,
              day: 4,
              display_date: 'title end'
            },
            group: 'title group',
            text: {
              text: 'title text',
              headline: 'title headline'
            },
            background: { color: 'title color' }
          } as TimelineSlideInterface,
          label: 'title label'
        };

        component.viewSlide = mockViewSlide; // needed because the input value won't be changed by triggering ngOnChanges!
        component.ngOnChanges({
          viewSlide: new SimpleChange(null, mockViewSlide, false)
        });

        component.onSubmit();

        const expectedOutput: TimelineViewSlideInterface = {
          type: TIMELINE_SLIDE_TYPES.TITLE,
          viewSlide: {
            start_date: {
              year: 1,
              month: 2,
              day: 3,
              display_date: 'title start'
            },
            end_date: {
              year: 2,
              month: 3,
              day: 4,
              display_date: 'title end'
            },
            group: 'title group',
            text: {
              text: 'title text',
              headline: 'title headline'
            },
            background: {
              color: 'title color'
            }
          },
          label: 'title label'
        };

        expect(saveViewSlideSpy).toHaveBeenCalledWith(expectedOutput);
      });

      it('should emit the updated viewSlide data of type era', () => {
        const mockViewSlide = {
          type: TIMELINE_SLIDE_TYPES.ERA,
          viewSlide: {
            start_date: {
              year: 1,
              month: 2,
              day: 3,
              display_date: 'foo start'
            },
            end_date: {
              year: 2,
              month: 3,
              day: 4,
              display_date: 'foo end'
            }
          } as TimelineEraInterface,
          label: 'foo label'
        };

        component.viewSlide = mockViewSlide; // needed because the input value won't be changed by triggering ngOnChanges!
        component.ngOnChanges({
          viewSlide: new SimpleChange(null, mockViewSlide, false)
        });

        component.onSubmit();

        const expectedOutput: TimelineViewSlideInterface = {
          type: TIMELINE_SLIDE_TYPES.ERA,
          viewSlide: {
            start_date: {
              year: 1,
              month: 2,
              day: 3,
              display_date: 'foo start'
            },
            end_date: {
              year: 2,
              month: 3,
              day: 4,
              display_date: 'foo end'
            }
          },
          label: 'foo label'
        };

        expect(saveViewSlideSpy).toHaveBeenCalledWith(expectedOutput);
      });

      it('should reset the forms initial data and emit isDirty = false', fakeAsync(() => {
        const mockViewSlide = {
          type: TIMELINE_SLIDE_TYPES.SLIDE,
          viewSlide: {
            start_date: {
              year: 1,
              month: 2,
              day: 3,
              display_date: 'foo start'
            },
            end_date: {
              year: 2,
              month: 3,
              day: 4,
              display_date: 'foo end'
            },
            group: 'foo group',
            text: {
              text: 'foo text',
              headline: 'foo headline'
            },
            background: { color: 'foo color' }
          } as TimelineSlideInterface,
          label: 'foo label'
        };

        component.viewSlide = mockViewSlide; // needed because the input value won't be changed by triggering ngOnChanges!
        component.ngOnChanges({
          viewSlide: new SimpleChange(null, mockViewSlide, false)
        });
        tick(300);

        jest.spyOn(component.isDirty, 'emit');
        component.onSubmit();

        expect(component.isDirty.emit).toHaveBeenCalledTimes(1);
        expect(component.isDirty.emit).toHaveBeenCalledWith(false);
      }));
    });

    describe('when invalid', () => {
      beforeEach(() => {
        component.slideForm.get('media').setErrors({ required: true }); // make the form invalid
        component.slideForm.updateValueAndValidity(); // make sure the form knows it's invalid
      });
      it('should not emit when the form data is invalid', () => {
        component.onSubmit();

        expect(saveViewSlideSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('isDirty', () => {
    beforeEach(() => {
      jest.spyOn(component.isDirty, 'emit');
    });

    it('should emit true if the initial form values != updated form values', fakeAsync(() => {
      component.slideForm.patchValue({ general: { group: 'updated value' } });
      tick(300);

      expect(component.isDirty.emit).toHaveBeenCalledTimes(1);
      expect(component.isDirty.emit).toHaveBeenCalledWith(true);
    }));

    it('should emit false if the updated form values === initial form values', fakeAsync(() => {
      // needed because TimelineEraInterface does not have a group property
      const viewSlideData = viewSlideMock.viewSlide as TimelineSlideInterface;

      component.slideForm.patchValue({ general: { group: 'updated value' } });
      component.slideForm.patchValue({
        general: { group: viewSlideData.group }
      }); // reset group value

      tick(300);
      expect(component.isDirty.emit).toHaveBeenCalledTimes(1);
      expect(component.isDirty.emit).toHaveBeenCalledWith(false);
    }));
  });

  describe('getErrorMessage', () => {
    let controlFn;
    const mockControl = hasError => ({
      hasError: () => hasError
    });

    beforeEach(() => {
      controlFn = jest.fn();
      component.getControl = controlFn;
    });

    const dates = ['start_date', 'end_date'];
    const props = ['month', 'day', 'hour', 'minute', 'second', 'millisecond'];
    const minMaxErrorMessages = [
      'De maand is een getal van 1 (januari) tot en met 12 (december).',
      'De dag is een getal van 1 tot en met 31.',
      'Het uur is een getal van 0 tot en met 23.',
      'De minuut is een getal van 0 tot en met 59.',
      'De seconde is een getal van 0 tot en met 59.',
      'De milliseconde kan niet minder dan 0 zijn.'
    ];
    const fallbackErrorMessages = [
      'Je hebt een ongeldige maand ingevuld.',
      'Je hebt een ongeldige dag ingevuld.',
      'Je hebt een ongeldig uur ingevuld.',
      'Je hebt een ongeldige minuut ingevuld.',
      'Je hebt een ongeldige seconde ingevuld.',
      'Je hebt een ongeldige milliseconde ingevuld.'
    ];
    const yearErrorMessages = [
      'Je moet een startjaar invullen.',
      'Je moet een eindjaar invullen.',
      'Je hebt een ongeldig jaar ingevuld.'
    ];
    const errorDictionnary = {
      min: minMaxErrorMessages,
      max: minMaxErrorMessages,
      other: fallbackErrorMessages
    };

    // Building testCase array with [{errorName: 'min', field: 'start_date', prop: 'millisecond', expect: '<The expected error message>'}, {...}]
    let testCases = dates.reduce((dateAcc, field) => {
      return [
        ...dateAcc,
        ...Object.keys(errorDictionnary).reduce((errorAcc, errorName) => {
          return [
            ...errorAcc,
            ...props.reduce((testAcc, prop, index) => {
              return [
                ...testAcc,
                {
                  field,
                  prop,
                  errorName,
                  expect: errorDictionnary[errorName][index]
                }
              ];
            }, [])
          ];
        }, [])
      ];
    }, []);

    testCases = [
      ...testCases,
      ...dates.reduce((dateAcc, field, index) => {
        const prop = 'year';
        return [
          ...dateAcc,
          {
            field,
            prop,
            errorName: 'required',
            expect: yearErrorMessages[index]
          },
          { field, prop, errorName: 'other', expect: yearErrorMessages[2] }
        ];
      }, [])
    ];

    testCases.forEach(tc => {
      // prettier-ignore
      it(`should return error message for ${tc.field}.${tc.prop} where control has ${tc.errorName} error`, () => { 
        const mock = mockControl(tc.errorName !== 'other')
        controlFn.mockReturnValue(mock);

        const result = component.getErrorMessage(`${tc.field}.${tc.prop}`);
        expect(result).toEqual(tc.expect);
      });
    });
    it('should return empty string if field was not found', () => {
      controlFn.mockReturnValue(null);

      const result = component.getErrorMessage('unknown');
      expect(result).toEqual('');
    });
  });
});

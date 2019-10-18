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
  MatIconRegistry,
  MatInputModule,
  MatListModule,
  MatRadioModule,
  MatStepperModule,
  MatTooltipModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
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
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: EditorViewModel,
          useClass: MockEditorViewModel
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

  describe('fileUploadResult input', () => {
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
});

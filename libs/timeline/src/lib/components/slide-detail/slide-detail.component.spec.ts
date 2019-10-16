import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule,
  MatListModule,
  MatRadioModule,
  MatStepperModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { TimelineSlideFixture } from '../../+fixtures/timeline-slide.fixture';
import {
  TimelineViewSlideInterface,
  TIMELINE_SLIDE_TYPES
} from '../../interfaces/timeline';
import { EditorViewModel } from '../editor.viewmodel';
import { MockEditorViewModel } from '../editor.viewmodel.mock';
import { SlideDetailComponent } from './slide-detail.component';

describe('SlideDetailComponent', () => {
  let component: SlideDetailComponent;
  let fixture: ComponentFixture<SlideDetailComponent>;
  const viewSlideMock: TimelineViewSlideInterface = {
    type: TIMELINE_SLIDE_TYPES.SLIDE,
    viewSlide: new TimelineSlideFixture(),
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

      it('should emit when the form data is valid', () => {
        component.onSubmit();
        expect(saveViewSlideSpy).toHaveBeenCalled();
        expect(saveViewSlideSpy).toHaveBeenCalledTimes(1);
      });

      it('should emit the updated viewSlide data', () => {
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
          },
          label: 'foo label'
        };

        component.viewSlide = mockViewSlide; // needed because the input value won't be changed by triggering ngOnChanges!
        component.ngOnChanges({
          viewSlide: new SimpleChange(null, mockViewSlide, false)
        });

        component.onSubmit();

        const expectedOutput: TimelineViewSlideInterface = {
          type: 3, // slide
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
});

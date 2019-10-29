import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIcon,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatStepperModule,
  MatTooltipModule
} from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import {
  TimelineViewSlideInterface,
  TIMELINE_SLIDE_TYPES
} from '../../interfaces/timeline';
import { EDITOR_HTTP_SERVICE_TOKEN } from '../../services/editor-http.service';
import { MockEditorViewModel } from '../editor.viewmodel.mock';
import { SettingsComponent } from '../settings/settings.component';
import {
  SlideDetailComponent,
  UploadFileOutput
} from '../slide-detail/slide-detail.component';
import { SlideListComponent } from '../slide-list/slide-list.component';
import { TimelineSlideFixture } from './../../+fixtures/timeline-slide.fixture';
import { TimelineSettingsInterface } from './../../interfaces/timeline';
import { StorageInfoInterface } from './../../services/editor-http.service.interface';
import { EditorViewModel } from './../editor.viewmodel';
import { EditorTimelineComponent } from './editor-timeline.component';

describe('EditorTimelineComponent', () => {
  let component: EditorTimelineComponent;
  let fixture: ComponentFixture<EditorTimelineComponent>;
  let viewmodel: EditorViewModel;

  const mockViewSlide = {
    type: TIMELINE_SLIDE_TYPES.SLIDE,
    viewSlide: new TimelineSlideFixture(),
    label: 'I am a label'
  } as TimelineViewSlideInterface;

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
        MatSlideToggleModule,
        NoopAnimationsModule,
        MatTooltipModule
      ],
      declarations: [
        EditorTimelineComponent,
        SlideListComponent,
        SlideDetailComponent,
        SettingsComponent
      ],
      providers: [
        { provide: EditorViewModel, useClass: MockEditorViewModel },
        { provide: EDITOR_HTTP_SERVICE_TOKEN, useValue: {} },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorTimelineComponent);
    component = fixture.componentInstance;
    viewmodel = TestBed.get(EditorViewModel);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handlers', () => {
    it('setActiveSlide', () => {
      viewmodel.setActiveSlide = jest.fn();
      component.setActiveSlide(mockViewSlide);

      expect(viewmodel.setActiveSlide).toHaveBeenCalledWith(mockViewSlide);
    });

    it('createSlide', () => {
      viewmodel.createSlide = jest.fn();
      component.createSlide();

      expect(viewmodel.createSlide).toHaveBeenCalled();
    });

    it('deleteActiveSlide', () => {
      viewmodel.deleteActiveSlide = jest.fn();
      component.deleteActiveSlide();

      expect(viewmodel.deleteActiveSlide).toHaveBeenCalled();
    });

    it('saveSlide', () => {
      viewmodel.upsertSlide = jest.fn();
      component.saveSlide(mockViewSlide);

      expect(viewmodel.upsertSlide).toHaveBeenCalledWith(mockViewSlide);
    });

    it('showSettings', () => {
      viewmodel.openSettings = jest.fn();
      component.showSettings();

      expect(viewmodel.openSettings).toHaveBeenCalled();
    });

    it('saveSettings', () => {
      const mockSettings = {} as TimelineSettingsInterface;
      viewmodel.updateSettings = jest.fn();
      component.saveSettings(mockSettings);

      expect(viewmodel.updateSettings).toHaveBeenCalledWith(mockSettings);
    });

    it('setIsFormDirty', () => {
      viewmodel.setFormDirty = jest.fn();
      component.setIsFormDirty(true);

      expect(viewmodel.setFormDirty).toHaveBeenCalledWith(true);
    });

    it('handleFileUpload', () => {
      const mockUpload: UploadFileOutput = {
        file: {
          lastModified: 1,
          name: 'blah',
          size: 1,
          type: 'png',
          slice: null
        },
        formControlName: 'media.url'
      };
      const mockStorageInfo: StorageInfoInterface = {
        name: 'foo',
        storageName: 'foo',
        eduFileId: 1
      };

      viewmodel.uploadFile = jest
        .fn()
        .mockReturnValue(hot('a', { a: mockStorageInfo }));

      component.handleFileUpload(mockUpload);

      expect(viewmodel.uploadFile).toHaveBeenCalledWith(mockUpload.file);
      expect(component.fileUploadResult$).toBeObservable(
        hot('a', {
          a: {
            formControlName: mockUpload.formControlName,
            url: '/api/EduFiles/' + mockStorageInfo.eduFileId + '/redirectURL'
          }
        })
      );
    });
  });

  describe('inputs', () => {
    it('should should pass apiBase and eduContentMetadataId', () => {
      const apiBase = 'foo';
      const eduContentMetadataId = 123;
      viewmodel.setHttpSettings = jest.fn();

      component.apiBase = apiBase;
      component.eduContentMetadataId = eduContentMetadataId;
      component.ngOnChanges(null);

      expect(viewmodel.setHttpSettings).toHaveBeenCalledWith({
        apiBase,
        eduContentMetadataId
      });
    });
  });

  describe('output', () => {
    it('should output errors from the viewmodel', () => {
      const error = new Error('I am an error');
      const error$ = viewmodel.errors$ as BehaviorSubject<Error>;
      component.errors.emit = jest.fn();

      error$.next(error);

      expect(component.errors.emit).toHaveBeenCalledWith(error);
    });
  });

  describe('template', () => {
    it('should show the slide list', () => {
      const slideListDE = fixture.debugElement.query(
        By.directive(SlideListComponent)
      );
      const slideList = slideListDE.componentInstance as SlideListComponent;

      expect(slideList).toBeDefined();

      // inputs
      expect(slideList.viewSlides).toEqual(
        (viewmodel.slideList$ as BehaviorSubject<TimelineViewSlideInterface[]>)
          .value
      );
      expect(slideList.activeViewSlide).toEqual(
        (viewmodel.activeSlide$ as BehaviorSubject<TimelineViewSlideInterface>)
          .value
      );

      //output
      component.setActiveSlide = jest.fn();
      slideList.clickSetSlide.next(mockViewSlide);

      expect(component.setActiveSlide).toHaveBeenCalledWith(mockViewSlide);
    });

    it('should show the settings button', () => {
      const buttonDEArray = fixture.debugElement.queryAll(
        By.css('.timeline-editor__main__button-container__button')
      );

      const settingsButtonDE = buttonDEArray[0];
      expect(settingsButtonDE).toBeDefined();

      const iconDE = settingsButtonDE.query(By.directive(MatIcon));
      expect(iconDE).toBeDefined();
      expect(iconDE.nativeElement.textContent.trim()).toBe('build');

      //click handler
      component.showSettings = jest.fn();

      settingsButtonDE.triggerEventHandler('click', null);
      expect(component.showSettings).toHaveBeenCalled();
    });

    it('should show the create slide button', () => {
      const buttonDEArray = fixture.debugElement.queryAll(
        By.css('.timeline-editor__main__button-container__button')
      );

      const settingsButtonDE = buttonDEArray[1];
      expect(settingsButtonDE).toBeDefined();

      const iconDE = settingsButtonDE.query(By.directive(MatIcon));
      expect(iconDE).toBeDefined();
      expect(iconDE.nativeElement.textContent.trim()).toBe('add_to_queue');

      //click handler
      component.createSlide = jest.fn();

      settingsButtonDE.triggerEventHandler('click', null);
      expect(component.createSlide).toHaveBeenCalled();
    });

    it('should show the delete slide button', () => {
      (viewmodel.activeSlide$ as BehaviorSubject<
        TimelineViewSlideInterface
      >).next(mockViewSlide);
      fixture.detectChanges();

      const buttonDEArray = fixture.debugElement.queryAll(
        By.css('.timeline-editor__main__button-container__button')
      );

      const settingsButtonDE = buttonDEArray[2];
      expect(settingsButtonDE).toBeDefined();

      const iconDE = settingsButtonDE.query(By.directive(MatIcon));
      expect(iconDE).toBeDefined();
      expect(iconDE.nativeElement.textContent.trim()).toBe('remove_from_queue');

      //click handler
      component.deleteActiveSlide = jest.fn();

      settingsButtonDE.triggerEventHandler('click', null);
      expect(component.deleteActiveSlide).toHaveBeenCalled();
    });

    it('should show the selected slide', () => {
      (viewmodel.activeSlideDetail$ as BehaviorSubject<
        TimelineViewSlideInterface
      >).next(mockViewSlide);
      fixture.detectChanges();

      const slideDetailDE = fixture.debugElement.query(
        By.directive(SlideDetailComponent)
      );
      const slideDetail = slideDetailDE.componentInstance as SlideDetailComponent;

      expect(slideDetail).toBeDefined();

      // inputs
      expect(slideDetail.viewSlide).toEqual(mockViewSlide);
      expect(slideDetail.canBeSavedAsTitle).toEqual(
        (viewmodel.activeSlideDetailCanSaveAsTitle$ as BehaviorSubject<boolean>)
          .value
      );
      // expect(slideDetail.fileUploadResult).toEqual(
      //   component.fileUploadResult$.
      // );

      // outputs
    });

    it('should show the timeline settings', () => {});

    it('should a warning if the form is dirty', () => {});
  });
});

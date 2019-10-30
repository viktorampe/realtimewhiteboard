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
  FileUploadResult,
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

  const mockFileUploadOutput: UploadFileOutput = {
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

  const mockFileUploadResult: FileUploadResult = {
    formControlName: 'media.url',
    url: '/api/EduFiles/123/redirectURL'
  };

  const mockSettings: TimelineSettingsInterface = {
    options: {
      relative: true,
      scale_factor: 2
    },
    scale: 'cosmological'
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
      viewmodel.uploadFile = jest
        .fn()
        .mockReturnValue(hot('a', { a: mockStorageInfo }));

      component.handleFileUpload(mockFileUploadOutput);

      expect(viewmodel.uploadFile).toHaveBeenCalledWith(
        mockFileUploadOutput.file
      );
      expect(component.fileUploadResult$).toBeObservable(
        hot('a', {
          a: {
            formControlName: mockFileUploadOutput.formControlName,
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
    describe('timeline slide list', () => {
      let slideList;

      beforeEach(() => {
        const slideListDE = fixture.debugElement.query(
          By.directive(SlideListComponent)
        );
        slideList = slideListDE.componentInstance as SlideListComponent;
      });

      it('should show the slide list', () => {
        expect(slideList).toBeDefined();
      });

      it('should set the viewSlides input', () => {
        const viewSlidesFromViewmodel = viewmodel.slideList$ as BehaviorSubject<
          TimelineViewSlideInterface[]
        >;
        viewSlidesFromViewmodel.next([mockViewSlide, mockViewSlide]);
        fixture.detectChanges();

        expect(slideList.viewSlides).toEqual([mockViewSlide, mockViewSlide]);
      });

      it('should set the activeViewSlide input', () => {
        const activeSlideFromViewModel = viewmodel.activeSlide$ as BehaviorSubject<
          TimelineViewSlideInterface
        >;
        activeSlideFromViewModel.next(mockViewSlide);
        fixture.detectChanges();

        expect(slideList.activeViewSlide).toEqual(mockViewSlide);
      });

      it('should handle the clickSetSlide output', () => {
        component.setActiveSlide = jest.fn();
        slideList.clickSetSlide.next(mockViewSlide);

        expect(component.setActiveSlide).toHaveBeenCalledWith(mockViewSlide);
      });
    });

    describe('buttons', () => {
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
        expect(iconDE.nativeElement.textContent.trim()).toBe(
          'remove_from_queue'
        );

        //click handler
        component.deleteActiveSlide = jest.fn();

        settingsButtonDE.triggerEventHandler('click', null);
        expect(component.deleteActiveSlide).toHaveBeenCalled();
      });
    });

    describe('timeline slide detail', () => {
      let activeSlideFromViewmodel;
      let slideDetail: SlideDetailComponent;

      beforeEach(() => {
        activeSlideFromViewmodel = viewmodel.activeSlideDetail$ as BehaviorSubject<
          TimelineViewSlideInterface
        >; // this stream has a value by default
        const slideDetailDE = fixture.debugElement.query(
          By.directive(SlideDetailComponent)
        );
        slideDetail = slideDetailDE.componentInstance;
      });

      it('should be present based on the activeSlide$', () => {
        expect(slideDetail).toBeDefined();

        activeSlideFromViewmodel.next(null);
        fixture.detectChanges();
        const slideDetailDE = fixture.debugElement.query(
          By.directive(SlideDetailComponent)
        );

        expect(slideDetailDE).toBeFalsy();
      });

      it('should set the selected slide', () => {
        activeSlideFromViewmodel.next(mockViewSlide);
        fixture.detectChanges();

        expect(slideDetail.viewSlide).toEqual(mockViewSlide);
      });

      it('should set the canBeSavedAsTitle input', () => {
        const canBeSavedAsTitleFromViewmodel = viewmodel.activeSlideDetailCanSaveAsTitle$ as BehaviorSubject<
          boolean
        >;
        canBeSavedAsTitleFromViewmodel.next(false);
        fixture.detectChanges();

        expect(slideDetail.canBeSavedAsTitle).toEqual(false);

        canBeSavedAsTitleFromViewmodel.next(true);
        fixture.detectChanges();

        expect(slideDetail.canBeSavedAsTitle).toEqual(true);
      });

      it('should set the fileUploadResult input', () => {
        component.fileUploadResult$.next(mockFileUploadResult);
        fixture.detectChanges();

        expect(slideDetail.fileUploadResult).toEqual(mockFileUploadResult);
      });

      it('should handle the uploadFile output', () => {
        component.handleFileUpload = jest.fn();
        slideDetail.uploadFile.emit(mockFileUploadOutput);

        expect(component.handleFileUpload).toHaveBeenCalledWith(
          mockFileUploadOutput
        );
      });

      it('should handle the saveViewSlide output', () => {
        component.saveSlide = jest.fn();
        slideDetail.saveViewSlide.emit(mockViewSlide);

        expect(component.saveSlide).toHaveBeenCalledWith(mockViewSlide);
      });

      it('should handle the isDirty output', () => {
        component.setIsFormDirty = jest.fn();
        slideDetail.isDirty.emit(true);

        expect(component.setIsFormDirty).toHaveBeenCalledWith(true);
      });
    });

    describe('timeline settings', () => {
      let settingsFromViewmodel, showSettingsFromViewmodel;
      let settings: SettingsComponent;

      beforeEach(() => {
        settingsFromViewmodel = viewmodel.settings$ as BehaviorSubject<
          TimelineSettingsInterface
        >; // this stream has a value by default

        showSettingsFromViewmodel = viewmodel.showSettings$ as BehaviorSubject<
          boolean
        >; // this stream has a default value of true

        const settingsDE = fixture.debugElement.query(
          By.directive(SettingsComponent)
        );
        settings = settingsDE.componentInstance;
      });

      it('should be present based on the showSettings$', () => {
        expect(settings).toBeDefined();

        showSettingsFromViewmodel.next(false);
        fixture.detectChanges();
        const settingsDE = fixture.debugElement.query(
          By.directive(SettingsComponent)
        );

        expect(settingsDE).toBeFalsy();
      });

      it('should set the settings input', () => {
        settingsFromViewmodel.next(mockSettings);
        fixture.detectChanges();

        expect(settings.settings).toEqual(mockSettings);
      });

      it('should handle the saveSettings output', () => {
        component.saveSettings = jest.fn();
        settings.saveSettings.emit(mockSettings);

        expect(component.saveSettings).toHaveBeenCalledWith(mockSettings);
      });

      it('should handle the isDirty output', () => {
        component.setIsFormDirty = jest.fn();
        settings.isDirty.emit(true);

        expect(component.setIsFormDirty).toHaveBeenCalledWith(true);
      });
    });

    it('should show a warning if a form is dirty', () => {
      const isFormDirtyFromViewmodel = viewmodel.isFormDirty$ as BehaviorSubject<
        boolean
      >; // this stream has a default value of true

      let formDirtyDE = fixture.debugElement.query(
        By.css('.timeline-editor__form-dirty-warning')
      );

      expect(formDirtyDE).toBeDefined();

      isFormDirtyFromViewmodel.next(false);
      fixture.detectChanges();
      formDirtyDE = fixture.debugElement.query(
        By.css('.timeline-editor__form-dirty-warning')
      );

      expect(formDirtyDE).toBeFalsy();
    });
  });
});

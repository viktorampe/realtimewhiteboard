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
  const viewSlide: TimelineViewSlideInterface = {
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
    component.viewSlide = viewSlide;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

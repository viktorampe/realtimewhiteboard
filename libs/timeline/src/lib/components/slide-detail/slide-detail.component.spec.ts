import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatStepperModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ENVIRONMENT_ICON_MAPPING_TOKEN } from '@campus/shared';
import { configureTestSuite } from 'ng-bullet';
import { TimelineSlideFixture } from '../../+fixtures/timeline-slide.fixture';
import {
  TimelineViewSlideInterface,
  TIMELINE_SLIDE_TYPES
} from '../../interfaces/timeline';
import { SlideDetailComponent } from './slide-detail.component';

describe('SlideDetailComponent', () => {
  let component: SlideDetailComponent;
  let fixture: ComponentFixture<SlideDetailComponent>;
  const viewSlide: TimelineViewSlideInterface = {
    type: TIMELINE_SLIDE_TYPES.SLIDE,
    viewSlide: new TimelineSlideFixture(),
    label: 'januari - februari 2019'
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatRadioModule,
        MatFormFieldModule,
        MatStepperModule,
        MatInputModule
      ],
      declarations: [SlideDetailComponent],
      providers: [{ provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} }]
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

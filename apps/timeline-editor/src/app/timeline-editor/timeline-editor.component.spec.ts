import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ENVIRONMENT_API_TOKEN,
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  TimelineModule
} from '@campus/timeline';
import { configureTestSuite } from 'ng-bullet';
import { TimelineEditorComponent } from './timeline-editor.component';

describe('TimelineEditorComponent', () => {
  let component: TimelineEditorComponent;
  let fixture: ComponentFixture<TimelineEditorComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TimelineModule, MatIconModule, NoopAnimationsModule],
      declarations: [TimelineEditorComponent],
      providers: [
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        { provide: ENVIRONMENT_API_TOKEN, useValue: { APIBase: '' } },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

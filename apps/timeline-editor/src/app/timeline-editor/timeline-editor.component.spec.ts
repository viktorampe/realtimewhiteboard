import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineModule } from '@campus/timeline';
import { configureTestSuite } from 'ng-bullet';
import { TimelineEditorComponent } from './timeline-editor.component';

describe('TimelineEditorComponent', () => {
  let component: TimelineEditorComponent;
  let fixture: ComponentFixture<TimelineEditorComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TimelineModule],
      declarations: [TimelineEditorComponent]
    }).compileComponents();
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

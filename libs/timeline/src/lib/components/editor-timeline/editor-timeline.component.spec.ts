import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatListModule } from '@angular/material';
import { configureTestSuite } from 'ng-bullet';
import { EDITOR_HTTP_SERVICE_TOKEN } from '../../services/editor-http.service';
import { EditorViewModel } from '../editor.viewmodel';
import { MockEditorViewModel } from '../editor.viewmodel.mock';
import { SlideListComponent } from '../slide-list/slide-list.component';
import { EditorTimelineComponent } from './editor-timeline.component';

describe('EditorTimelineComponent', () => {
  let component: EditorTimelineComponent;
  let fixture: ComponentFixture<EditorTimelineComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatListModule, MatIconModule],
      declarations: [EditorTimelineComponent, SlideListComponent],
      providers: [
        { provide: EditorViewModel, useClass: MockEditorViewModel },
        { provide: EDITOR_HTTP_SERVICE_TOKEN, useValue: {} }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

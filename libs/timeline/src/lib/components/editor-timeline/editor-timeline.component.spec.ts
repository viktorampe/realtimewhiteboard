import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material';
import { configureTestSuite } from 'ng-bullet';
import { SlideListComponent } from '../slide-list/slide-list.component';
import { EditorViewModel } from './../editor.viewmodel';
import { MockEditorViewModel } from './../editor.viewmodel.mock';
import { EditorTimelineComponent } from './editor-timeline.component';

describe('EditorTimelineComponent', () => {
  let component: EditorTimelineComponent;
  let fixture: ComponentFixture<EditorTimelineComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatListModule],
      declarations: [EditorTimelineComponent, SlideListComponent],
      providers: [{ provide: EditorViewModel, useClass: MockEditorViewModel }]
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

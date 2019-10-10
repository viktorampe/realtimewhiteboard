import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material';
import { EditorViewModel } from '../editor.viewmodel';
import { MockEditorViewModel } from '../editor.viewmodel.mock';
import { SlideListComponent } from '../slide-list/slide-list.component';
import { EditorTimelineComponent } from './editor-timeline.component';

describe('EditorTimelineComponent', () => {
  let component: EditorTimelineComponent;
  let fixture: ComponentFixture<EditorTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatListModule],
      declarations: [EditorTimelineComponent, SlideListComponent],
      providers: [{ provide: EditorViewModel, useClass: MockEditorViewModel }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

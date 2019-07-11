import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MethodChapterLessonComponent } from './method-chapter-lesson.component';

describe('MethodChapterLessonComponent', () => {
  let component: MethodChapterLessonComponent;
  let fixture: ComponentFixture<MethodChapterLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MethodChapterLessonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodChapterLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

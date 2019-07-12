import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { MethodChapterLessonComponent } from './method-chapter-lesson.component';

describe('MethodChapterLessonComponent', () => {
  let component: MethodChapterLessonComponent;
  let fixture: ComponentFixture<MethodChapterLessonComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MethodChapterLessonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodChapterLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

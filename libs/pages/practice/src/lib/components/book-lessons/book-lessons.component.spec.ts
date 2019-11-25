import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { MatCardModule, MatIconRegistry, MatListItem } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { PracticeViewModel } from '../practice.viewmodel';
import { MockPracticeViewModel } from '../practice.viewmodel.mock';
import { BookLessonsComponent } from './book-lessons.component';

describe('BookLessonsComponent', () => {
  let component: BookLessonsComponent;
  let fixture: ComponentFixture<BookLessonsComponent>;
  let practiceViewModel: MockPracticeViewModel;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        UiModule,
        SharedModule
      ],
      declarations: [BookLessonsComponent],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {}
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        { provide: PracticeViewModel, useClass: MockPracticeViewModel },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} }
      ]
    });
  });

  beforeEach(() => {
    practiceViewModel = TestBed.get(PracticeViewModel);
    practiceViewModel.currentPracticeParams$.next({ book: 1, chapter: 1 });
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(BookLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the chapter links', () => {
    const navDE = fixture.debugElement.query(By.css('div[aside]'));
    const chapters = navDE.queryAll(By.directive(MatListItem));
    expect(chapters.length).toBe(5); // one chapter, 4 lessons
  });

  describe('click handlers', () => {
    it('should navigate to the bookChapter when clickToBookChapters is called', fakeAsync(() => {
      component.clickToBookChapters(1);
      tick();

      expect(router.navigate).toHaveBeenCalledWith(['/practice', 1]);
    }));

    it('should navigate to the lesson when openToc is called with lessonId', fakeAsync(() => {
      component.clickOpenToc(1, 2, 3);
      tick();
      expect(router.navigate).toHaveBeenCalledWith(['/practice', 1, 2, 3]);
    }));

    it('should navigate to the chapter when openToc is called without lessonId', fakeAsync(() => {
      component.clickOpenToc(1, 2);
      tick();
      expect(router.navigate).toHaveBeenCalledWith(['/practice', 1, 2]);
    }));
  });
});

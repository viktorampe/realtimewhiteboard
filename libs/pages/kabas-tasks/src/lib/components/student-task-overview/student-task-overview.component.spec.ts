import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ENVIRONMENT_UI_TOKEN, UiModule } from '@campus/ui';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject, of } from 'rxjs';
import { StudentTaskFixture } from '../../interfaces/StudentTask.fixture';
import { StudentTaskInterface } from '../../interfaces/StudentTask.interface';
import { StudentTasksViewModel } from './../student-tasks.viewmodel';
import { MockStudentTasksViewModel } from './../student-tasks.viewmodel.mock';
import { StudentTaskOverviewComponent } from './student-task-overview.component';

describe('StudentTaskOverviewComponent', () => {
  let component: StudentTaskOverviewComponent;
  let fixture: ComponentFixture<StudentTaskOverviewComponent>;
  let router: Router;
  let viewmodel: StudentTasksViewModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule, RouterTestingModule],
      declarations: [StudentTaskOverviewComponent],
      providers: [
        { provide: ENVIRONMENT_UI_TOKEN, useValue: {} },
        { provide: StudentTasksViewModel, useClass: MockStudentTasksViewModel }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTaskOverviewComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    viewmodel = TestBed.get(StudentTasksViewModel);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('practice page redirect', () => {
    it('should navigate to free practice when empty-state cta is clicked', async () => {
      jest.spyOn(router, 'navigate');
      component.emptyStateClick();

      expect(router.navigate).toHaveBeenCalledWith(['practice']);
    });
  });

  describe('Empty State', () => {
    it('should show emtpy state for active tasks', () => {
      component.taskCount$ = of(0);
      component.showFinishedTasks$.next(false);
      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.css('.ui-empty-state'));
      expect(emptyState).toBeDefined();

      const titleDE = emptyState.query(By.css('.ui-empty-state__title'));
      const descriptionDE = emptyState.query(
        By.css('.ui-empty-state__description')
      );
      const ctaDE = emptyState.query(By.css('.ui-empty-state__cta .ui-button'));

      expect(titleDE.nativeElement.textContent).toBe('Je bent helemaal mee');
      expect(descriptionDE.nativeElement.textContent).toBe(
        'Er staan geen taken voor je klaar. Je kan altijd vrij oefenen.'
      );
      expect(ctaDE.nativeElement.textContent).toBe('Naar vrij oefenen');
    });

    it('should show emtpy state for finished tasks', () => {
      component.taskCount$ = of(0);
      component.showFinishedTasks$.next(true);
      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.css('.ui-empty-state'));
      expect(emptyState).toBeDefined();

      const titleDE = emptyState.query(By.css('.ui-empty-state__title'));
      const descriptionDE = emptyState.query(
        By.css('.ui-empty-state__description')
      );

      expect(titleDE.nativeElement.textContent).toBe('Hier is niets te zien');
      expect(descriptionDE.nativeElement.textContent).toBe(
        'Je hebt nog geen afgewerkte taken.'
      );

      // No cta in finished tasks
      const ctaDE = emptyState.query(By.css('.ui-empty-state__cta .ui-button'));
      expect(ctaDE).toBeNull();
    });
  });

  //file.only
  describe('presentation streams', () => {
    let viewmodelStudentTasks$: BehaviorSubject<StudentTaskInterface[]>;

    beforeEach(() => {
      viewmodelStudentTasks$ = viewmodel.studentTasks$ as BehaviorSubject<
        StudentTaskInterface[]
      >;
    });

    describe('taskCount$', () => {
      const mockTasks = [
        new StudentTaskFixture({ isFinished: true }),
        new StudentTaskFixture({ isFinished: true }),
        new StudentTaskFixture({ isFinished: false }),
        new StudentTaskFixture({ isFinished: false }),
        new StudentTaskFixture({ isFinished: false })
      ];

      beforeEach(() => {
        viewmodelStudentTasks$.next(mockTasks);
      });

      it('should emit the correct amount of tasks - active', () => {
        component.setShowFinishedTasks(false);

        expect(component.taskCount$).toBeObservable(hot('a', { a: 3 }));
      });

      it('should emit the correct amount of tasks - finished', () => {
        component.setShowFinishedTasks(true);

        expect(component.taskCount$).toBeObservable(hot('a', { a: 2 }));
      });
    });

    describe('tasksByLearningAreaInfo$', () => {
      const mockTasks = [
        new StudentTaskFixture({
          learningAreaId: 1,
          learningAreaName: 'Wiskunde',
          isFinished: true
        }),
        new StudentTaskFixture({
          learningAreaId: 2,
          learningAreaName: 'Frans',
          isFinished: true
        }),
        new StudentTaskFixture({
          learningAreaId: 1,
          learningAreaName: 'Wiskunde',
          isFinished: false,
          isUrgent: true
        }),
        new StudentTaskFixture({
          learningAreaId: 2,
          learningAreaName: 'Frans',
          isFinished: false,
          isUrgent: true
        }),
        new StudentTaskFixture({
          learningAreaId: 1,
          learningAreaName: 'Wiskunde',
          isFinished: false,
          isUrgent: false
        })
      ];

      beforeEach(() => {
        viewmodelStudentTasks$.next(mockTasks);
      });

      it('should emit the learningAreaInfo - active', () => {
        component.setShowFinishedTasks(false);

        const expected = [
          {
            learningAreaId: 2,
            learningAreaName: 'Frans',
            taskCount: 1,
            urgentCount: 1
          },
          {
            learningAreaId: 1,
            learningAreaName: 'Wiskunde',
            taskCount: 2,
            urgentCount: 1
          }
        ];

        expect(component.tasksByLearningAreaInfo$).toBeObservable(
          hot('a', { a: expected })
        );
      });

      it('should emit the learningAreaInfo - finished', () => {
        component.setShowFinishedTasks(true);

        const expected = [
          {
            learningAreaId: 2,
            learningAreaName: 'Frans',
            taskCount: 1,
            urgentCount: 0
          },
          {
            learningAreaId: 1,
            learningAreaName: 'Wiskunde',
            taskCount: 1,
            urgentCount: 0
          }
        ];

        expect(component.tasksByLearningAreaInfo$).toBeObservable(
          hot('a', { a: expected })
        );
      });
    });

    describe('taskListSections$', () => {
      const mockTasks = [
        new StudentTaskFixture({ learningAreaName: 'Wiskunde' })
      ];

      beforeEach(() => {
        viewmodelStudentTasks$.next(mockTasks);
      });
    });
  });
});

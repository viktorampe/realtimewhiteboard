import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ENVIRONMENT_UI_TOKEN, UiModule } from '@campus/ui';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { StudentTaskFixture } from '../../interfaces/StudentTask.fixture';
import { TaskInfoByLearningAreaPipe } from '../manage-kabas-tasks-overview/task-info-by-learning-area.pipe';
import { StudentTasksViewModel } from '../student-tasks.viewmodel';
import { MockStudentTasksViewModel } from '../student-tasks.viewmodel.mock';
import { StudentTaskOverviewComponent } from './student-task-overview.component';
// file.only
describe('StudentTaskOverviewComponent', () => {
  let component: StudentTaskOverviewComponent;
  let fixture: ComponentFixture<StudentTaskOverviewComponent>;
  let router: Router;
  let viewModel: MockStudentTasksViewModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule, RouterTestingModule],
      declarations: [StudentTaskOverviewComponent, TaskInfoByLearningAreaPipe],
      providers: [
        { provide: ENVIRONMENT_UI_TOKEN, useValue: {} },
        { provide: StudentTasksViewModel, useClass: MockStudentTasksViewModel }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTaskOverviewComponent);
    component = fixture.componentInstance;
    viewModel = TestBed.get(StudentTasksViewModel);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('practice page redirect', () => {
    it('should navigate to free practice when empty-state cta is clicked', async () => {
      jest.spyOn(router, 'navigate');
      component.emptyStateClick('foo');

      expect(router.navigate).toHaveBeenCalledWith(['foo']);
    });
  });

  describe('Empty State', () => {
    describe('inEmptyState$', () => {
      it('should emit true when there are no tasks', () => {
        viewModel.studentTasks$.next([]);
        expect(component.inEmptyState$).toBeObservable(hot('a', { a: true }));
      });

      it('should emit false when there are tasks', () => {
        viewModel.studentTasks$.next([new StudentTaskFixture()]);
        expect(component.inEmptyState$).toBeObservable(hot('a', { a: false }));
      });
    });
    it('should show emtpy state for active tasks', () => {
      component.tasks$ = of([]);
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
      component.tasks$ = of([]);
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

  describe('sectionTitle$', () => {
    it('should display the correct section title when there are no tasks and the finished tasks filter is off', () => {
      component.tasks$ = of([]);

      expect(component.sectionTitle$).toBeObservable(
        hot('a', {
          a: 'Er staan geen taken voor je klaar'
        })
      );
    });

    it('should display the correct section title when there are no tasks and the finished tasks filter is on', () => {
      component.showFinishedTasks$.next(true);
      viewModel.studentTasks$.next([]);

      expect(component.sectionTitle$).toBeObservable(
        hot('a', {
          a: 'Je hebt geen afgewerkte taken'
        })
      );
    });

    it('should display the correct section title when there are tasks and the finished tasks filter is off', () => {
      viewModel.studentTasks$.next([new StudentTaskFixture()]);

      expect(component.sectionTitle$).toBeObservable(
        hot('a', {
          a: '1 taak staat voor je klaar'
        })
      );
    });

    it('should display the correct section title when there are tasks and the finished tasks filter is on', () => {
      component.showFinishedTasks$.next(true);
      viewModel.studentTasks$.next([new StudentTaskFixture()]);

      expect(component.sectionTitle$).toBeObservable(
        hot('a', {
          a: 'Deze taken heb je gemaakt'
        })
      );
    });
  });

  describe('emptyStateData$', () => {
    beforeEach(() => {
      component.inEmptyState$ = hot('a', { a: true });
    });
    it('should stream the correct data for finished tasks', () => {
      component.showFinishedTasks$.next(false);

      expect(component.emptyStateData$).toBeObservable(
        hot('a', {
          a: {
            title: 'Je bent helemaal mee',
            description:
              'Er staan geen taken voor je klaar. Je kan altijd vrij oefenen.',
            ctaLabel: 'Naar vrij oefenen',
            ctaLink: 'practice',
            svgIcon: 'empty-state-all-done'
          }
        })
      );
    });
    it('should stream the correct data for active tasks', () => {
      component.showFinishedTasks$.next(true);

      expect(component.emptyStateData$).toBeObservable(
        hot('a', {
          a: {
            title: 'Hier is niets te zien',
            description: 'Je hebt nog geen afgewerkte taken.',
            svgIcon: 'empty-state-all-done'
          }
        })
      );
    });
  });

  describe('scrollTo()', () => {
    it('should scroll to the provided target', () => {
      const scrollSpy = jest
        .spyOn(document, 'getElementById')
        .mockReturnValue({ scrollIntoView: jest.fn() } as any);

      component.scrollTo(1);

      expect(scrollSpy).toHaveBeenCalledWith('1');
    });
  });
});

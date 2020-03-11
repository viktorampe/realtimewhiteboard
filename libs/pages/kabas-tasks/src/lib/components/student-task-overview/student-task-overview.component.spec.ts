import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ENVIRONMENT_UI_TOKEN, UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { TaskInfoByLearningAreaPipe } from '../manage-kabas-tasks-overview/task-info-by-learning-area.pipe';
import { StudentTaskOverviewComponent } from './student-task-overview.component';
// file.only
describe('StudentTaskOverviewComponent', () => {
  let component: StudentTaskOverviewComponent;
  let fixture: ComponentFixture<StudentTaskOverviewComponent>;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule, RouterTestingModule],
      declarations: [StudentTaskOverviewComponent, TaskInfoByLearningAreaPipe],
      providers: [{ provide: ENVIRONMENT_UI_TOKEN, useValue: {} }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTaskOverviewComponent);
    component = fixture.componentInstance;
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
});

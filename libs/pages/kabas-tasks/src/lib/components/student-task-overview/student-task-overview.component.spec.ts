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
import { TaskInfoByLearningAreaPipe } from '../../pipes/task-info-by-learning-area.pipe';
import { StudentTasksViewModel } from '../student-tasks.viewmodel';
import { MockStudentTasksViewModel } from '../student-tasks.viewmodel.mock';
import { StudentTaskOverviewComponent } from './student-task-overview.component';

describe('StudentTaskOverviewComponent', () => {
  let component: StudentTaskOverviewComponent;
  let fixture: ComponentFixture<StudentTaskOverviewComponent>;
  let router: Router;
  let viewmodel: StudentTasksViewModel;

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
      component.emptyStateClick('foo');

      expect(router.navigate).toHaveBeenCalledWith(['foo']);
    });
  });

  describe('Empty State', () => {
    describe('inEmptyState$', () => {
      it('should emit true when there are no tasks', () => {
        viewmodel.studentTasks$.next([]);
        expect(component.taskCount$).toBeObservable(hot('a', { a: 0 }));
      });

      it('should emit false when there are tasks', () => {
        viewmodel.studentTasks$.next([new StudentTaskFixture()]);
        expect(component.taskCount$).toBeObservable(hot('a', { a: 1 }));
      });
    });
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

  describe('sectionTitle$', () => {
    let viewmodelStudentTasks$: BehaviorSubject<StudentTaskInterface[]>;

    beforeEach(() => {
      viewmodelStudentTasks$ = viewmodel.studentTasks$ as BehaviorSubject<
        StudentTaskInterface[]
      >;
    });

    it('should display the correct section title when there are no active tasks', () => {
      component.showFinishedTasks$.next(false);
      viewmodelStudentTasks$.next([]);

      expect(component.sectionTitle$).toBeObservable(
        hot('a', {
          a: 'Er staan geen taken voor je klaar'
        })
      );
    });

    it('should display the correct section title when there are no finished tasks', () => {
      component.showFinishedTasks$.next(true);
      viewmodelStudentTasks$.next([]);

      expect(component.sectionTitle$).toBeObservable(
        hot('a', {
          a: 'Je hebt geen afgewerkte taken'
        })
      );
    });

    it('should display the correct section title when there are active tasks', () => {
      component.showFinishedTasks$.next(false);

      viewmodelStudentTasks$.next([
        new StudentTaskFixture({ isFinished: false })
      ]);

      expect(component.sectionTitle$).toBeObservable(
        hot('a', {
          a: '1 taak staat voor je klaar'
        })
      );

      viewmodelStudentTasks$.next([
        new StudentTaskFixture({ isFinished: false }),
        new StudentTaskFixture({ isFinished: false })
      ]);

      expect(component.sectionTitle$).toBeObservable(
        hot('b', {
          b: '2 taken staan voor je klaar'
        })
      );
    });

    it('should display the correct section title when there are finished tasks', () => {
      component.showFinishedTasks$.next(true);
      viewmodelStudentTasks$.next([
        new StudentTaskFixture({ isFinished: true })
      ]);

      expect(component.sectionTitle$).toBeObservable(
        hot('a', {
          a: 'Deze taken heb je gemaakt'
        })
      );
    });
  });

  describe('emptyStateData$', () => {
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

  describe('presentation streams', () => {
    let viewmodelStudentTasks$: BehaviorSubject<StudentTaskInterface[]>;

    const {
      wiskunde,
      frans,
      vandaag,
      volgendeWeekDonderdag,
      volgendeWeekVrijdag,
      gisteren,
      vorigeWeekDonderdag,
      vorigeWeekVrijdag
    } = getPresets();

    beforeEach(() => {
      viewmodelStudentTasks$ = viewmodel.studentTasks$ as BehaviorSubject<
        StudentTaskInterface[]
      >;
    });

    describe('taskCount$', () => {
      const mockTasks = [
        new StudentTaskFixture({ ...vorigeWeekVrijdag }),
        new StudentTaskFixture({ ...gisteren }),
        new StudentTaskFixture({ ...volgendeWeekDonderdag }),
        new StudentTaskFixture({ ...volgendeWeekDonderdag }),
        new StudentTaskFixture({ ...vorigeWeekVrijdag })
      ];

      beforeEach(() => {
        viewmodelStudentTasks$.next(mockTasks);
      });

      it('should emit the correct amount of tasks - active', () => {
        component.showFinishedTasks$.next(false);

        expect(component.taskCount$).toBeObservable(hot('a', { a: 2 }));
      });

      it('should emit the correct amount of tasks - finished', () => {
        component.showFinishedTasks$.next(true);

        expect(component.taskCount$).toBeObservable(hot('a', { a: 3 }));
      });
    });

    describe('tasksByLearningAreaInfo$', () => {
      const mockTasks = [
        new StudentTaskFixture({ ...wiskunde, ...vorigeWeekDonderdag }),
        new StudentTaskFixture({ ...frans, ...vorigeWeekDonderdag }),
        new StudentTaskFixture({ ...wiskunde, ...vandaag }),
        new StudentTaskFixture({ ...frans, ...vandaag }),
        new StudentTaskFixture({ ...wiskunde, ...volgendeWeekDonderdag })
      ];

      beforeEach(() => {
        viewmodelStudentTasks$.next(mockTasks);
      });

      it('should emit the learningAreaInfo - active', () => {
        component.showFinishedTasks$.next(false);

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
        component.showFinishedTasks$.next(true);

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
      describe('active tasks', () => {
        const mockTasks = [
          new StudentTaskFixture({ ...wiskunde, ...vandaag }),
          new StudentTaskFixture({ ...wiskunde, ...vandaag }),
          new StudentTaskFixture({ ...frans, ...vandaag }),
          new StudentTaskFixture({ ...frans, ...volgendeWeekVrijdag }),
          new StudentTaskFixture({ ...frans, ...volgendeWeekDonderdag }),
          new StudentTaskFixture({ ...frans, ...gisteren })
        ];

        beforeEach(() => {
          viewmodelStudentTasks$.next(mockTasks);
          component.showFinishedTasks$.next(false);
        });

        it('should emit the correct sections, grouped by date', () => {
          component.isGroupedByDate$.next(true);

          const expected = [
            {
              items: [mockTasks[2], mockTasks[0], mockTasks[1]],
              label: 'vandaag'
            },
            {
              items: [mockTasks[4], mockTasks[3]],
              label: 'volgende week'
            }
          ];

          expect(component.taskListSections$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should emit the correct sections, grouped by learningArea', () => {
          component.isGroupedByDate$.next(false);

          const expected = [
            {
              items: [mockTasks[2], mockTasks[4], mockTasks[3]],
              label: 'Frans',
              learningAreaId: 2
            },
            {
              items: [mockTasks[0], mockTasks[1]],
              label: 'Wiskunde',
              learningAreaId: 1
            }
          ];

          expect(component.taskListSections$).toBeObservable(
            hot('a', { a: expected })
          );
        });
      });

      describe('finished tasks', () => {
        const mockTasks = [
          new StudentTaskFixture({ ...wiskunde, ...vorigeWeekVrijdag }),
          new StudentTaskFixture({ ...wiskunde, ...vorigeWeekDonderdag }),
          new StudentTaskFixture({ ...frans, ...vorigeWeekVrijdag }),
          new StudentTaskFixture({ ...frans, ...gisteren }),
          new StudentTaskFixture({ ...frans, ...volgendeWeekDonderdag })
        ];

        beforeEach(() => {
          viewmodelStudentTasks$.next(mockTasks);
          component.showFinishedTasks$.next(true);
        });

        it('should emit the correct sections, grouped by date', () => {
          component.isGroupedByDate$.next(true);

          const expected = [
            {
              items: [mockTasks[3]],
              label: 'gisteren'
            },
            {
              items: [mockTasks[2], mockTasks[0], mockTasks[1]],
              label: 'vorige week'
            }
          ];

          expect(component.taskListSections$).toBeObservable(
            hot('a', { a: expected })
          );
        });

        it('should emit the correct sections, grouped by learningArea', () => {
          component.isGroupedByDate$.next(false);

          const expected = [
            {
              items: [mockTasks[3], mockTasks[2]],
              label: 'Frans',
              learningAreaId: 2
            },
            {
              items: [mockTasks[0], mockTasks[1]],
              label: 'Wiskunde',
              learningAreaId: 1
            }
          ];

          expect(component.taskListSections$).toBeObservable(
            hot('a', { a: expected })
          );
        });
      });
    });
  });
});

function getPresets(): { [key: string]: Partial<StudentTaskInterface> } {
  // learningArea presets
  const wiskunde = { learningAreaId: 1, learningAreaName: 'Wiskunde' };
  const frans = { learningAreaId: 2, learningAreaName: 'Frans' };

  // date presets
  const vandaag = {
    dateGroupLabel: 'vandaag',
    dateLabel: 'vandaag',
    endDate: new Date(2020, 2, 12),
    isUrgent: true,
    isFinished: false
  };
  const volgendeWeekVrijdag = {
    dateGroupLabel: 'volgende week',
    dateLabel: 'vrijdag',
    endDate: new Date(2020, 2, 20),
    isUrgent: false,
    isFinished: false
  };
  const volgendeWeekDonderdag = {
    dateGroupLabel: 'volgende week',
    dateLabel: 'donderdag',
    endDate: new Date(2020, 2, 19),
    isUrgent: false,
    isFinished: false
  };
  const gisteren = {
    dateGroupLabel: 'gisteren',
    dateLabel: 'gisteren',
    endDate: new Date(2020, 2, 11),
    isUrgent: false,
    isFinished: true
  };
  const vorigeWeekDonderdag = {
    dateGroupLabel: 'vorige week',
    dateLabel: 'donderdag',
    endDate: new Date(2020, 2, 5),
    isUrgent: false,
    isFinished: true
  };
  const vorigeWeekVrijdag = {
    dateGroupLabel: 'vorige week',
    dateLabel: 'vrijdag',
    endDate: new Date(2020, 2, 6),
    isUrgent: false,
    isFinished: true
  };

  return {
    wiskunde,
    frans,
    vandaag,
    volgendeWeekDonderdag,
    volgendeWeekVrijdag,
    gisteren,
    vorigeWeekDonderdag,
    vorigeWeekVrijdag
  };
}

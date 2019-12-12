import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconModule,
  MatIconRegistry,
  MatListModule,
  MatSelect,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { hot } from '@nrwl/nx/testing';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskWithAssigneesInterface } from '../../interfaces/TaskWithAssignees.interface';
import { PagesKabasTasksModule } from '../../pages-kabas-tasks.module';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';
import {
  ManageKabasTasksOverviewComponent,
  TaskSortEnum
} from './manage-kabas-tasks-overview.component';

describe('ManageKabasTasksOverviewComponent', () => {
  let component: ManageKabasTasksOverviewComponent;
  let fixture: ComponentFixture<ManageKabasTasksOverviewComponent>;
  const queryParams: BehaviorSubject<Params> = new BehaviorSubject<Params>({});
  let kabasTasksViewModel: KabasTasksViewModel;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PagesKabasTasksModule,
        NoopAnimationsModule,
        MatListModule,
        MatTabsModule,
        MatIconModule,
        RouterTestingModule,
        SharedModule,
        RouterTestingModule,
        MatTooltipModule,
        PagesKabasTasksModule,
        UiModule
      ],
      declarations: [],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        { provide: ActivatedRoute, useValue: { queryParams } },
        { provide: KabasTasksViewModel, useClass: MockKabasTasksViewModel },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageKabasTasksOverviewComponent);
    component = fixture.componentInstance;
    kabasTasksViewModel = TestBed.get(KabasTasksViewModel);
    router = TestBed.get(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Task sorting', () => {
    let digitalTasks$: BehaviorSubject<TaskWithAssigneesInterface[]>;
    let paperTasks$: BehaviorSubject<TaskWithAssigneesInterface[]>;

    beforeEach(() => {
      digitalTasks$ = kabasTasksViewModel.tasksWithAssignments$ as BehaviorSubject<
        TaskWithAssigneesInterface[]
      >;
      paperTasks$ = kabasTasksViewModel.paperTasksWithAssignments$ as BehaviorSubject<
        TaskWithAssigneesInterface[]
      >;
    });

    describe('sort modes', () => {
      it('should order by name', () => {
        let id = 0;
        const tasks = [
          { id: 1, name: 'zzzzzz' },
          { id: 2, name: 'Aaa' },
          { id: 3, name: 'aaa' },
          { id: 4, name: 'Aaa' },
          { id: 5, name: '' }
        ] as TaskWithAssigneesInterface[];

        component.setSortMode(TaskSortEnum.NAME);
        digitalTasks$.next(tasks);
        paperTasks$.next(tasks);

        expect(
          component.tasksWithAssignments$.pipe(
            map(tasks => tasks.map(task => task.id))
          )
        ).toBeObservable(hot('a', { a: [5, 2, 3, 4, 1] }));

        expect(
          component.paperTasksWithAssignments$.pipe(
            map(tasks => tasks.map(task => task.id))
          )
        ).toBeObservable(hot('a', { a: [5, 2, 3, 4, 1] }));
      });

      it('should order by learningArea', () => {
        let id = 0;
        const tasks = [
          { id: 1, learningArea: { name: 'zzzzzz' } },
          { id: 2, learningArea: { name: 'Aaa' } },
          { id: 3, learningArea: { name: 'aaa' } },
          { id: 4, learningArea: { name: 'Aaa' } },
          { id: 5, learningArea: { name: '' } }
        ] as TaskWithAssigneesInterface[];

        component.setSortMode(TaskSortEnum.LEARNINGAREA);
        digitalTasks$.next(tasks);
        paperTasks$.next(tasks);

        expect(
          component.tasksWithAssignments$.pipe(
            map(tasks => tasks.map(task => task.id))
          )
        ).toBeObservable(hot('a', { a: [5, 2, 3, 4, 1] }));

        expect(
          component.paperTasksWithAssignments$.pipe(
            map(tasks => tasks.map(task => task.id))
          )
        ).toBeObservable(hot('a', { a: [5, 2, 3, 4, 1] }));
      });

      it('should order by startDate', () => {
        let id = 0;
        const tasks = [
          { id: 1, startDate: undefined },
          { id: 2, startDate: new Date('1-1-2018') },
          { id: 3, startDate: new Date('1-1-2018') },
          { id: 4, startDate: new Date('1-1-2017') },
          { id: 5, startDate: undefined }
        ] as TaskWithAssigneesInterface[];

        component.setSortMode(TaskSortEnum.STARTDATE);
        digitalTasks$.next(tasks);

        expect(
          component.tasksWithAssignments$.pipe(
            map(tasks => tasks.map(task => task.id))
          )
        ).toBeObservable(hot('a', { a: [1, 5, 4, 2, 3] }));
      });
    });

    describe('page events', () => {
      it('should call setSortMode', async () => {
        component.setSortMode = jest.fn();

        const matSelect = fixture.debugElement.query(By.directive(MatSelect))
          .componentInstance as MatSelect;
        matSelect.selectionChange.emit({
          source: undefined,
          value: TaskSortEnum.LEARNINGAREA
        });

        expect(component.setSortMode).toHaveBeenCalledWith(
          TaskSortEnum.LEARNINGAREA
        );
      });

      it('should reset the sorting when switching tabs', () => {
        const matSelect = fixture.debugElement.query(By.directive(MatSelect))
          .componentInstance as MatSelect;
        matSelect.value = TaskSortEnum.LEARNINGAREA;

        component.setSortMode = jest.fn();

        component.onSelectedTabIndexChanged(1); // change tab

        expect(component.setSortMode).toHaveBeenCalledWith(TaskSortEnum.NAME);
        expect(matSelect.value).toBeUndefined();
      });
    });
  });

  describe('tabs', () => {
    describe('onSelectedTabIndexChanged', () => {
      it('should navigate with the new tab index in the queryParams', () => {
        const tab = 1;

        component.onSelectedTabIndexChanged(tab);

        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([], {
          queryParams: { tab }
        });
      });
    });
    it('should open correct tab when navigating with tab in queryParams', () => {
      const tab = 1;

      queryParams.next({ tab });

      expect(component.currentTab$).toBeObservable(hot('a', { a: tab }));
    });
  });
});

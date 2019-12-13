import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconRegistry,
  MatSelect,
  MatSelectModule,
  MatSlideToggleModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GuardsModule } from '@campus/guards';
import { PagesSharedModule } from '@campus/pages/shared';
import { SearchModule } from '@campus/search';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssigneeTypesEnum } from '../../interfaces/Assignee.interface';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from '../../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';
import { TaskListItemComponent } from '../task-list-item/task-list-item.component';
import {
  FilterStateInterface,
  ManageKabasTasksOverviewComponent,
  TaskSortEnum
} from './manage-kabas-tasks-overview.component';

describe('ManageKabasTasksOverviewComponent', () => {
  let component: ManageKabasTasksOverviewComponent;
  let fixture: ComponentFixture<ManageKabasTasksOverviewComponent>;

  const queryParams: BehaviorSubject<Params> = new BehaviorSubject<Params>({});
  let kabasTasksViewModel: KabasTasksViewModel;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        CommonModule,
        UiModule,
        PagesSharedModule,
        SharedModule,
        SearchModule,
        GuardsModule,
        RouterTestingModule,
        MatSlideToggleModule,
        MatSelectModule
      ],
      providers: [
        {
          provide: KabasTasksViewModel,
          useClass: MockKabasTasksViewModel
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        { provide: ActivatedRoute, useValue: { queryParams } },
        { provide: KabasTasksViewModel, useClass: MockKabasTasksViewModel },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} }
      ],
      declarations: [ManageKabasTasksOverviewComponent, TaskListItemComponent]
    });
  });

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

  describe('filteredTasks$', () => {
    it('should filter on searchTerm', () => {
      const filterState: FilterStateInterface = { searchTerm: 'foo' };

      const mockTasks = [
        { name: 'foo' },
        { name: 'bar' }
      ] as TaskWithAssigneesInterface[];

      const result = component['filterTasks'](filterState, mockTasks);

      expect(result).toEqual([mockTasks[0]]);
    });

    it('should filter on status', () => {
      const filterState: FilterStateInterface = {
        status: [TaskStatusEnum.ACTIVE, TaskStatusEnum.FINISHED]
      };

      const mockTasks = [
        {
          status: TaskStatusEnum.ACTIVE // matches
        },
        { status: TaskStatusEnum.PENDING }, // no match
        { status: TaskStatusEnum.FINISHED } // matches
      ] as TaskWithAssigneesInterface[];

      const result = component['filterTasks'](filterState, mockTasks);

      expect(result).toEqual([mockTasks[0], mockTasks[2]]);
    });

    it('should filter on learningArea', () => {
      const filterState: FilterStateInterface = { learningArea: [2, 3] };
      const mockTasks = [
        { learningAreaId: 1 },
        { learningAreaId: 2 },
        { learningAreaId: 3 },
        { learningAreaId: 2 }
      ] as TaskWithAssigneesInterface[];
      const result = component['filterTasks'](filterState, mockTasks);

      expect(result).toEqual([mockTasks[1], mockTasks[2], mockTasks[3]]);
    });

    it('should filter on assignee', () => {
      const filterState: FilterStateInterface = {
        assignee: [
          { type: AssigneeTypesEnum.GROUP, id: 1 },
          { type: AssigneeTypesEnum.STUDENT, id: 1 },
          { type: AssigneeTypesEnum.CLASSGROUP, id: 1 }
        ]
      };

      const mockTasks: TaskWithAssigneesInterface[] = [
        {
          assignees: [
            { type: AssigneeTypesEnum.GROUP, id: 1 }, // matches filter
            { type: AssigneeTypesEnum.STUDENT, id: 3 }, // does not match
            { type: AssigneeTypesEnum.CLASSGROUP, id: 3 } // does not match
          ]
        },
        {
          assignees: [
            { type: AssigneeTypesEnum.GROUP, id: 2 }, // does not match filter
            { type: AssigneeTypesEnum.STUDENT, id: 1 } // matches filter --> task should be included in result
          ]
        },
        {
          assignees: [{ type: AssigneeTypesEnum.STUDENT, id: 1 }]
        },
        {
          assignees: [{ type: AssigneeTypesEnum.STUDENT, id: 2 }] // does not match
        },
        {
          assignees: [{ type: AssigneeTypesEnum.CLASSGROUP, id: 1 }] // matches
        },
        {
          assignees: [{ type: AssigneeTypesEnum.CLASSGROUP, id: 2 }] // does not match
        },
        {
          assignees: [
            { type: AssigneeTypesEnum.STUDENT, id: 666 }, // does not match
            { type: AssigneeTypesEnum.GROUP, id: 666 }, // does not match
            { type: AssigneeTypesEnum.GROUP, id: 1 }, // matches --> should be included
            { type: AssigneeTypesEnum.CLASSGROUP, id: 666 } // does not match
          ]
        }
      ] as TaskWithAssigneesInterface[];

      const result = component['filterTasks'](filterState, mockTasks);

      expect(result).toEqual([
        mockTasks[0],
        mockTasks[1],
        mockTasks[2],
        mockTasks[4],
        mockTasks[6]
      ]);
    });

    it('should filter on dateInterval', () => {
      const filterState: FilterStateInterface = {
        dateInterval: { gte: new Date(2000, 5, 10), lte: new Date(2000, 5, 20) }
      };

      const mockTasks: TaskWithAssigneesInterface[] = [
        {
          startDate: new Date(2000, 5, 11),
          endDate: new Date(2000, 5, 14) // matches
        },
        {
          startDate: new Date(2000, 5, 10),
          endDate: new Date(2000, 5, 20) // matches
        },
        {
          startDate: new Date(2000, 5, 5),
          endDate: new Date(2000, 5, 25) // matches
        },
        {
          startDate: new Date(2000, 5, 14),
          endDate: new Date(2000, 5, 25) // matches
        },
        {
          startDate: new Date(2000, 5, 21),
          endDate: new Date(2000, 5, 28) // no match
        },
        {
          startDate: new Date(2000, 5, 1),
          endDate: new Date(2000, 5, 5) // no match
        }
      ] as TaskWithAssigneesInterface[];

      const result = component['filterTasks'](filterState, mockTasks);

      expect(result).toEqual([
        mockTasks[0],
        mockTasks[1],
        mockTasks[2],
        mockTasks[3]
      ]);
    });

    it('should combine multiple filters', () => {
      const filterState: FilterStateInterface = {
        searchTerm: 'foo',
        learningArea: [1],
        status: [TaskStatusEnum.ACTIVE, TaskStatusEnum.PENDING],
        assignee: [
          { type: AssigneeTypesEnum.GROUP, id: 1 },
          { type: AssigneeTypesEnum.CLASSGROUP, id: 2 }
        ],
        dateInterval: { gte: new Date(2000, 1, 1), lte: new Date(2000, 1, 10) }
      };

      const mockTasks = [
        {
          name: 'foo', //matches all filters
          learningAreaId: 1,
          status: TaskStatusEnum.ACTIVE,
          startDate: new Date(2000, 1, 2),
          endDate: new Date(2000, 1, 9),
          assignees: [
            {
              type: AssigneeTypesEnum.GROUP,
              id: 1
            }
          ]
        },
        {
          name: 'bar', // does not match search term filter
          learningAreaId: 1,
          status: TaskStatusEnum.ACTIVE,
          startDate: new Date(2000, 1, 2),
          endDate: new Date(2000, 1, 9),
          assignees: [
            {
              type: AssigneeTypesEnum.GROUP,
              id: 1
            }
          ]
        },
        {
          name: 'foo', // does not match all filters
          learningAreaId: 2, // does not match
          status: TaskStatusEnum.ACTIVE,
          startDate: new Date(2000, 1, 2),
          endDate: new Date(2000, 1, 9),
          assignees: [
            {
              type: AssigneeTypesEnum.GROUP,
              id: 1
            }
          ]
        },
        {
          name: 'foo', // does not match all filters
          learningAreaId: 1,
          status: TaskStatusEnum.ACTIVE,
          startDate: new Date(2000, 1, 2),
          endDate: new Date(2000, 1, 9),
          assignees: [
            {
              type: AssigneeTypesEnum.CLASSGROUP, // does not match
              id: 1
            }
          ]
        },
        {
          name: 'foo', // does not match all filters
          learningAreaId: 1,
          status: TaskStatusEnum.ACTIVE,
          startDate: new Date(2000, 1, 2),
          endDate: new Date(2000, 1, 9),
          assignees: [
            {
              type: AssigneeTypesEnum.GROUP,
              id: 2 // does not match
            }
          ]
        },
        {
          name: 'foo', // does not match all filters
          learningAreaId: 1,
          status: TaskStatusEnum.FINISHED, // does not match
          startDate: new Date(2000, 1, 2),
          endDate: new Date(2000, 1, 9),
          assignees: [
            {
              type: AssigneeTypesEnum.GROUP,
              id: 1
            }
          ]
        },
        {
          name: 'foo', // does not match all filters
          learningAreaId: 1,
          status: TaskStatusEnum.PENDING,
          startDate: new Date(2000, 1, 15), // no match
          endDate: new Date(2000, 1, 20), // no match
          assignees: [
            {
              type: AssigneeTypesEnum.GROUP,
              id: 1
            }
          ]
        },
        {
          name: 'foobar', //matches all filters
          learningAreaId: 1,
          status: TaskStatusEnum.PENDING, // matches --> include
          startDate: new Date(2000, 1, 2),
          endDate: new Date(2000, 1, 9),
          assignees: [
            {
              type: AssigneeTypesEnum.GROUP,
              id: 1
            },
            {
              type: AssigneeTypesEnum.GROUP,
              id: 1
            }
          ]
        },
        {
          name: 'foobar', //matches all filters
          learningAreaId: 1,
          status: TaskStatusEnum.PENDING,
          startDate: new Date(2000, 1, 2),
          endDate: new Date(2000, 1, 9),
          assignees: [
            {
              type: AssigneeTypesEnum.GROUP, //matches
              id: 666 // does not match
            },
            {
              type: AssigneeTypesEnum.CLASSGROUP, //matches
              id: 2 // matches
            }
          ]
        }
      ] as TaskWithAssigneesInterface[];

      const result = component['filterTasks'](filterState, mockTasks);

      expect(result).toEqual([mockTasks[0], mockTasks[7], mockTasks[8]]);
    });
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
        const mockTasks = [
          { id: 1, name: 'zzzzzz' },
          { id: 2, name: 'Aaa' },
          { id: 3, name: 'aaa' },
          { id: 4, name: 'Aaa' },
          { id: 5, name: '' }
        ] as TaskWithAssigneesInterface[];

        component.setSortMode(TaskSortEnum.NAME);
        digitalTasks$.next(mockTasks);
        paperTasks$.next(mockTasks);

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
        const mockTasks = [
          { id: 1, learningArea: { name: 'zzzzzz' } },
          { id: 2, learningArea: { name: 'Aaa' } },
          { id: 3, learningArea: { name: 'aaa' } },
          { id: 4, learningArea: { name: 'Aaa' } },
          { id: 5, learningArea: { name: '' } }
        ] as TaskWithAssigneesInterface[];

        component.setSortMode(TaskSortEnum.LEARNINGAREA);
        digitalTasks$.next(mockTasks);
        paperTasks$.next(mockTasks);

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
        const mockTasks = [
          { id: 1, startDate: undefined },
          { id: 2, startDate: new Date('1-1-2018') },
          { id: 3, startDate: new Date('1-1-2018') },
          { id: 4, startDate: new Date('1-1-2017') },
          { id: 5, startDate: undefined }
        ] as TaskWithAssigneesInterface[];

        component.setSortMode(TaskSortEnum.STARTDATE);
        digitalTasks$.next(mockTasks);

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

        const matSelect = fixture.debugElement.query(
          By.css('.manage-kabas-tasks-overview--sorting')
        ).componentInstance as MatSelect;
        matSelect.selectionChange.emit({
          source: undefined,
          value: TaskSortEnum.LEARNINGAREA
        });

        expect(component.setSortMode).toHaveBeenCalledWith(
          TaskSortEnum.LEARNINGAREA
        );
      });

      it('should reset the sorting when switching tabs', () => {
        const matSelect = fixture.debugElement.query(
          By.css('.manage-kabas-tasks-overview--sorting')
        ).componentInstance as MatSelect;
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

import { CommonModule } from '@angular/common';
import { QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconRegistry,
  MatSelect,
  MatSelectionList,
  MatSelectModule,
  MatSlideToggleModule
} from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskFixture } from '@campus/dal';
import { GuardsModule } from '@campus/guards';
import { PagesSharedModule } from '@campus/pages/shared';
import { ButtonToggleFilterComponent, SearchModule } from '@campus/search';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { hot } from '@nrwl/angular/testing';
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
  ManageKabasTasksOverviewComponent,
  Source,
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

        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
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

  describe('filter selection changed handlers', () => {
    describe('archivedFilterToggled()', () => {
      it('should clear and disable the status filter', () => {
        const statusToggleButton: ButtonToggleFilterComponent = fixture.debugElement.query(
          By.directive(ButtonToggleFilterComponent)
        ).componentInstance;

        // select multiple statuses
        statusToggleButton.toggleControl.setValue(
          [
            {
              ...component.taskStatusFilter,
              ...{
                values: [
                  {
                    data: {
                      status: 'pending',
                      icon: 'filter:pending'
                    },
                    visible: true,
                    selected: true // select value
                  },
                  {
                    data: {
                      status: 'active',
                      icon: 'filter:active'
                    },
                    visible: true,
                    selected: true // select value
                  },
                  {
                    data: {
                      status: 'finished',
                      icon: 'filter:finished'
                    },
                    visible: true,
                    selected: true // select value
                  }
                ]
              }
            }
          ],
          { emitEvent: true }
        );

        const noOptionsSelected = { ...component.taskStatusFilter };

        // toggle archived filter
        component.archivedFilterToggled(
          { checked: true, source: null },
          'digital'
        );

        fixture.detectChanges();

        expect(component.isArchivedFilterActive).toBe(true);
        expect(statusToggleButton.disabled).toBe(true);
        expect(statusToggleButton.filterCriteria).toEqual(noOptionsSelected);
      });
    });
  });

  describe('filteredTasks$', () => {
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

    ['digital', 'paper'].forEach((source: Source) => {
      function getTasks$(taskSource) {
        if (taskSource === 'digital') {
          return digitalTasks$;
        }
        if (taskSource === 'paper') {
          return paperTasks$;
        }
      }

      function getComponentTasks$(taskSource) {
        if (taskSource === 'digital') {
          return component.digitalFilteredTasks$;
        }
        if (taskSource === 'paper') {
          return component.paperFilteredTasks$;
        }
      }

      it('should filter on searchTerm', () => {
        const mockTasks = [
          { name: 'foo' },
          { name: 'bar' }
        ] as TaskWithAssigneesInterface[];

        getTasks$(source).next(mockTasks);

        component.searchTermUpdated('foo', source);

        expect(getComponentTasks$(source)).toBeObservable(
          hot('a', { a: [mockTasks[0]] })
        );
      });

      it('should filter on status', () => {
        const mockTasks = [
          {
            status: TaskStatusEnum.ACTIVE // matches
          },
          { status: TaskStatusEnum.PENDING }, // no match
          { status: TaskStatusEnum.FINISHED } // matches
        ] as TaskWithAssigneesInterface[];

        getTasks$(source).next(mockTasks);
        component.selectionChanged(
          [
            {
              values: [
                { data: { status: TaskStatusEnum.ACTIVE }, selected: true },
                { data: { status: TaskStatusEnum.FINISHED }, selected: true }
              ]
            } as any
          ],
          'status',
          source
        );

        expect(getComponentTasks$(source)).toBeObservable(
          hot('a', { a: [mockTasks[0], mockTasks[2]] })
        );
      });

      it('should filter on learningArea', () => {
        const mockTasks = [
          { learningAreaId: 1 },
          { learningAreaId: 2 },
          { learningAreaId: 3 },
          { learningAreaId: 2 }
        ] as TaskWithAssigneesInterface[];

        getTasks$(source).next(mockTasks);
        component.selectionChanged(
          [
            {
              values: [
                { data: { id: 2 }, selected: true },
                { data: { id: 3 }, selected: true }
              ]
            } as any
          ],
          'learningArea',
          source
        );

        expect(getComponentTasks$(source)).toBeObservable(
          hot('a', {
            a: [mockTasks[1], mockTasks[2], mockTasks[3]]
          })
        );
      });

      it('should filter on assignee', () => {
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

        getTasks$(source).next(mockTasks);
        component.selectionChanged(
          [
            {
              values: [
                {
                  data: {
                    identifier: { type: AssigneeTypesEnum.GROUP, id: 1 }
                  },
                  selected: true
                },
                {
                  data: {
                    identifier: { type: AssigneeTypesEnum.STUDENT, id: 1 }
                  },
                  selected: true
                },
                {
                  data: {
                    identifier: { type: AssigneeTypesEnum.CLASSGROUP, id: 1 }
                  },
                  selected: true
                }
              ]
            } as any
          ],
          'assignee',
          source
        );

        expect(getComponentTasks$(source)).toBeObservable(
          hot('a', {
            a: [
              mockTasks[0],
              mockTasks[1],
              mockTasks[2],
              mockTasks[4],
              mockTasks[6]
            ]
          })
        );
      });

      describe('dateIntervalFilter', () => {
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

        beforeEach(() => {
          getTasks$(source).next(mockTasks);
        });

        it('should filter on start and end date', () => {
          component.selectionChanged(
            [
              {
                values: [
                  {
                    data: {
                      gte: new Date(2000, 5, 10),
                      lte: new Date(2000, 5, 20)
                    }
                  }
                ]
              } as any
            ],
            'dateInterval',
            source
          );

          expect(getComponentTasks$(source)).toBeObservable(
            hot('a', {
              a: [mockTasks[0], mockTasks[1], mockTasks[2], mockTasks[3]]
            })
          );
        });

        it('should filter on start date', () => {
          component.selectionChanged(
            [
              {
                values: [
                  {
                    data: {
                      gte: new Date(2000, 5, 10)
                    }
                  }
                ]
              } as any
            ],
            'dateInterval',
            source
          );

          expect(getComponentTasks$(source)).toBeObservable(
            hot('a', {
              a: [
                mockTasks[0],
                mockTasks[1],
                mockTasks[2],
                mockTasks[3],
                mockTasks[4]
              ]
            })
          );
        });

        it('should filter on end date', () => {
          component.selectionChanged(
            [
              {
                values: [
                  {
                    data: {
                      lte: new Date(2000, 5, 10)
                    }
                  }
                ]
              } as any
            ],
            'dateInterval',
            source
          );

          expect(getComponentTasks$(source)).toBeObservable(
            hot('a', {
              a: [mockTasks[1], mockTasks[2], mockTasks[5]]
            })
          );
        });
      });

      it('should filter on archived', () => {
        const mockTasks = [
          { archivedYear: 2000 }, // matches
          { archivedYear: null }, // no match
          { learningAreaId: 3 } // no match
        ] as TaskWithAssigneesInterface[];

        getTasks$(source).next(mockTasks);
        component.archivedFilterToggled(
          { source: null, checked: true },
          source
        );

        expect(getComponentTasks$(source)).toBeObservable(
          hot('a', {
            a: [mockTasks[0]]
          })
        );
      });

      it('should combine multiple filters', () => {
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
        getTasks$(source).next(mockTasks);

        //searchTerm
        component.searchTermUpdated('foo', source);

        // learningArea
        component.selectionChanged(
          [{ values: [{ data: { id: 1 }, selected: true }] } as any],
          'learningArea',
          source
        );

        //status
        component.selectionChanged(
          [
            {
              values: [
                { data: { status: TaskStatusEnum.ACTIVE }, selected: true },
                { data: { status: TaskStatusEnum.PENDING }, selected: true }
              ]
            } as any
          ],
          'status',
          source
        );

        // assignees
        component.selectionChanged(
          [
            {
              values: [
                {
                  data: {
                    identifier: { type: AssigneeTypesEnum.GROUP, id: 1 }
                  },
                  selected: true
                },
                {
                  data: {
                    identifier: { type: AssigneeTypesEnum.CLASSGROUP, id: 2 }
                  },
                  selected: true
                }
              ]
            } as any
          ],
          'assignee',
          source
        );

        //dateInterval
        component.selectionChanged(
          [
            {
              values: [
                {
                  data: {
                    gte: new Date(2000, 1, 1),
                    lte: new Date(2000, 1, 10)
                  }
                }
              ]
            } as any
          ],
          'dateInterval',
          source
        );

        expect(getComponentTasks$(source)).toBeObservable(
          hot('a', {
            a: [mockTasks[0], mockTasks[7], mockTasks[8]]
          })
        );
      });
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
          { id: 1, learningArea: { name: 'zzzzzz' }, name: 'abc' },
          { id: 2, learningArea: { name: 'Aaa' }, name: 'baa' },
          { id: 3, learningArea: { name: 'aaa' }, name: 'akc' },
          { id: 4, learningArea: { name: 'Aaa' }, name: 'foo' },
          { id: 5, learningArea: { name: '' }, name: 'bar' }
        ] as TaskWithAssigneesInterface[];

        component.setSortMode(TaskSortEnum.LEARNINGAREA);
        digitalTasks$.next(mockTasks);
        paperTasks$.next(mockTasks);

        expect(
          component.tasksWithAssignments$.pipe(
            map(tasks => tasks.map(task => task.id))
          )
        ).toBeObservable(hot('a', { a: [5, 3, 2, 4, 1] }));

        expect(
          component.paperTasksWithAssignments$.pipe(
            map(tasks => tasks.map(task => task.id))
          )
        ).toBeObservable(hot('a', { a: [5, 3, 2, 4, 1] }));
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
      it('should call setSortMode', () => {
        component.setSortMode = jest.fn();

        const matSelect = fixture.debugElement.query(
          By.css('.manage-kabas-tasks-overview__sorting')
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
          By.css('.manage-kabas-tasks-overview__sorting')
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

  describe('getActions()', () => {
    const mockTask = new TaskFixture({ id: 666 }) as TaskWithAssigneesInterface;
    let actions: { label: string; handler: Function }[];

    beforeEach(() => {
      jest.resetAllMocks();
    });

    beforeAll(() => {
      actions = component.getActions(mockTask);
    });

    it('first action should navigate to task-detail', () => {
      actions[0].handler();
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith([
        'tasks',
        'manage',
        mockTask.id
      ]);
    });
  });

  describe('clickDeleteTasks()', () => {
    const selectedDigitalTasks = [{ id: 1, name: 'foo' }];
    const selectedPaperTasks = [{ id: 2, name: 'bar' }];

    const digitalSelectionList = getSelectionListWithSelectedValues(
      selectedDigitalTasks
    );
    const paperSelectionList = getSelectionListWithSelectedValues(
      selectedPaperTasks
    );

    let removeTasksSpy;

    beforeEach(() => {
      removeTasksSpy = jest.spyOn(kabasTasksViewModel, 'removeTasks');
    });

    it('should call vm.removeTasks with the selected digital tasks', () => {
      setSelectionList(digitalSelectionList);

      component.clickDeleteTasks();

      expect(removeTasksSpy).toHaveBeenCalledTimes(1);
      expect(removeTasksSpy).toHaveBeenCalledWith(selectedDigitalTasks);
    });

    it('should call vm.removeTasks with the selected paper tasks', () => {
      setSelectionList(paperSelectionList);

      component.clickDeleteTasks();

      expect(removeTasksSpy).toHaveBeenCalledTimes(1);
      expect(removeTasksSpy).toHaveBeenCalledWith(selectedPaperTasks);
    });
  });

  function setSelectionList(selection: MatSelectionList) {
    const queryList = new QueryList<MatSelectionList>();
    queryList.reset([selection]);
    component.taskLists = queryList;
    fixture.detectChanges();
  }

  function getSelectionListWithSelectedValues(
    selectedValues
  ): MatSelectionList {
    const mockSelectionList: MatSelectionList = {
      selectedOptions: {
        selected: selectedValues.map(task => {
          return { value: task };
        })
      }
    } as MatSelectionList;

    return mockSelectionList;
  }
});

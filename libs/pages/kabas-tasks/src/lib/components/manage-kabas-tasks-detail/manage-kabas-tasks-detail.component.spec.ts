import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogRef,
  MatIconRegistry,
  MatListOption,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTooltip
} from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  EduContentFixture,
  LearningAreaFixture,
  LearningAreaInterface,
  TaskEduContentFixture
} from '@campus/dal';
import {
  SearchFilterComponentInterface,
  SearchFilterCriteriaInterface,
  SearchModule
} from '@campus/search';
import {
  CONTENT_ACTIONS_SERVICE_TOKEN,
  CONTENT_OPENER_TOKEN,
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { ConfirmationModalComponent, UiModule } from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject, of } from 'rxjs';
import { AssigneeFixture } from '../../interfaces/Assignee.fixture';
import {
  CurrentTaskParams,
  KabasTasksViewModel
} from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';
import {
  NewTaskComponent,
  NewTaskFormValues
} from '../new-task/new-task.component';
import { TaskEduContentListItemComponent } from '../task-edu-content-list-item/task-edu-content-list-item.component';
import { AssigneeInterface } from './../../interfaces/Assignee.interface';
import { TaskEduContentWithEduContentInterface } from './../../interfaces/TaskEduContentWithEduContent.interface';
import { TaskWithAssigneesInterface } from './../../interfaces/TaskWithAssignees.interface';
import { ManageKabasTasksAssigneeModalComponent } from './../manage-kabas-tasks-assignee-modal/manage-kabas-tasks-assignee-modal.component';
import { ManageKabasTasksDetailComponent } from './manage-kabas-tasks-detail.component';

describe('ManageKabasTasksDetailComponent', () => {
  let component: ManageKabasTasksDetailComponent;
  let fixture: ComponentFixture<ManageKabasTasksDetailComponent>;
  let viewModel: MockKabasTasksViewModel;
  let matDialog: MatDialog;
  let router: Router;
  const queryParams: BehaviorSubject<Params> = new BehaviorSubject<Params>({});

  let mockViewmodel: MockKabasTasksViewModel;
  let currentTask: TaskWithAssigneesInterface;
  let restOfTasks: TaskWithAssigneesInterface[];
  let taskEduContents: TaskEduContentWithEduContentInterface[];

  // replaces value of the currentTask$  of the mockViewmodel
  const updateCurrentTask = newCurrentTask => {
    mockViewmodel.tasksWithAssignments$.next([newCurrentTask, ...restOfTasks]);
    fixture.detectChanges();
  };

  // adds actions to each item of TaskEduContentWithEduContentInterface[]
  const addActions = (
    tECs: TaskEduContentWithEduContentInterface[],
    actions = []
  ) => {
    tECs = tECs.map(tEC => Object.assign(tEC, { actions }));
    return tECs;
  };

  // create a taskEduContentWithEduContent fixture
  const createTaskEduContent = (
    id = 1,
    title = 'oefening 1',
    required = false,
    diaboloPhaseId = 1,
    levelId = 1,
    actions = []
  ) =>
    Object.assign(
      new TaskEduContentFixture({
        id,
        required,
        eduContent: new EduContentFixture(
          {},
          { title, diaboloPhaseId, levelId }
        )
      }),
      { actions }
    );

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        MatSlideToggleModule,
        MatSelectModule,
        SearchModule,
        UiModule,
        NoopAnimationsModule,
        MatRadioModule,
        RouterTestingModule
      ],
      declarations: [
        ManageKabasTasksDetailComponent,
        TaskEduContentListItemComponent
      ],
      providers: [
        { provide: KabasTasksViewModel, useClass: MockKabasTasksViewModel },
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        },
        {
          provide: MatDialog,
          useValue: {
            open: () => ({
              afterClosed: () => of('test')
            })
          }
        },
        { provide: Router, useValue: { navigate: () => {} } },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams,
            snapshot: { queryParams: queryParams.getValue() }
          }
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: CONTENT_ACTIONS_SERVICE_TOKEN,
          useValue: { getActionsForEduContent: () => [] }
        },
        {
          provide: CONTENT_OPENER_TOKEN,
          useValue: {
            openEduContentAsExercise: () => {},
            openEduContentAsSolution: () => {},
            openEduContentAsStream: () => {},
            openEduContentAsDownload: () => {},
            openBoeke: () => {},
            previewEduContentAsImage: () => {}
          }
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        },
        {
          provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
          useValue: { open: jest.fn() }
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: FILTER_SERVICE_TOKEN,
          useValue: { matchFilters: () => {} }
        }
      ]
    });
  });

  beforeEach(() => {
    viewModel = TestBed.get(KabasTasksViewModel);
    matDialog = TestBed.get(MatDialog);
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(ManageKabasTasksDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockViewmodel = viewModel as MockKabasTasksViewModel;
    [currentTask, ...restOfTasks] = mockViewmodel.tasksWithAssignments$.value;
    taskEduContents = addActions(currentTask.taskEduContents);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openAssigneeModal', () => {
    let afterClosed$: BehaviorSubject<AssigneeInterface[]>;

    beforeEach(() => {
      const dialog = TestBed.get(MatDialog);
      afterClosed$ = new BehaviorSubject<AssigneeInterface[]>([]);
      dialog.open = jest.fn(() => ({ afterClosed: () => afterClosed$ }));
    });

    it('should open the task assignees modal', () => {
      const mockClassGroups = mockViewmodel.classGroups$.value;
      const mockGroups = mockViewmodel.groups$.value;
      const mockStudents = mockViewmodel.students$.value;

      const expectedTaskClassGroups = [
        {
          label: mockClassGroups[0].name,
          relationId: 1,
          type: 'classgroup'
        },
        {
          label: mockClassGroups[1].name,
          relationId: 2,
          type: 'classgroup'
        },
        {
          label: mockClassGroups[2].name,
          relationId: 3,
          type: 'classgroup'
        }
      ];
      const expectedTaskGroups = [
        {
          label: mockGroups[0].name,
          relationId: 1,
          type: 'group'
        },
        {
          label: mockGroups[1].name,
          relationId: 2,
          type: 'group'
        },
        {
          label: mockGroups[2].name,
          relationId: 3,
          type: 'group'
        }
      ];

      const expectedTaskStudents = [
        {
          label: mockStudents[0].displayName,
          relationId: 1,
          type: 'student'
        },
        {
          label: mockStudents[1].displayName,
          relationId: 2,
          type: 'student'
        },
        {
          label: mockStudents[2].displayName,
          relationId: 3,
          type: 'student'
        }
      ];

      const expectedData = {
        title: currentTask.name,
        isPaperTask: currentTask.isPaperTask,
        currentTaskAssignees: currentTask.assignees,
        possibleTaskClassGroups: expectedTaskClassGroups,
        possibleTaskGroups: expectedTaskGroups,
        possibleTaskStudents: expectedTaskStudents
      };
      const expectedClass = 'manage-task-assignees';

      component.openAssigneeModal();

      expect(matDialog.open).toHaveBeenCalledWith(
        ManageKabasTasksAssigneeModalComponent,
        {
          data: expectedData,
          panelClass: expectedClass
        }
      );
    });

    it('should update the task assignee access on dialog close', () => {
      const dialogResult = [new AssigneeFixture()];
      viewModel.updateTaskAccess = jest.fn();

      afterClosed$.next(dialogResult);
      component.openAssigneeModal();
      expect(viewModel.updateTaskAccess).toHaveBeenCalledWith(
        currentTask,
        dialogResult
      );
    });

    it('should not update the task assignee access on dialog close, without data', () => {
      const dialogResult = undefined;
      viewModel.updateTaskAccess = jest.fn();

      afterClosed$.next(dialogResult);
      component.openAssigneeModal();
      expect(viewModel.updateTaskAccess).not.toHaveBeenCalled();
    });
  });

  describe('isNewTask$', () => {
    it('should be true if currentTaskParams does not have a task id', () => {
      (viewModel.currentTaskParams$ as BehaviorSubject<CurrentTaskParams>).next(
        {
          id: undefined
        }
      );

      expect(component.isNewTask$).toBeObservable(
        hot('a', {
          a: true
        })
      );
    });

    it('should be false if currentTaskParams has a task id', () => {
      (viewModel.currentTaskParams$ as BehaviorSubject<CurrentTaskParams>).next(
        {
          id: 1
        }
      );

      expect(component.isNewTask$).toBeObservable(
        hot('a', {
          a: false
        })
      );
    });

    it('should call openNewTaskDialog when there is a new task', () => {
      jest.spyOn(component, 'openNewTaskDialog');

      (viewModel.currentTaskParams$ as BehaviorSubject<CurrentTaskParams>).next(
        {
          id: undefined
        }
      );
      component.ngOnInit();

      expect(component.openNewTaskDialog).toHaveBeenCalled();
    });

    it('should not call openNewTaskDialog when we are in an existing task', () => {
      jest.spyOn(component, 'openNewTaskDialog');

      (viewModel.currentTaskParams$ as BehaviorSubject<CurrentTaskParams>).next(
        {
          id: 1
        }
      );
      component.ngOnInit();

      expect(component.openNewTaskDialog).not.toHaveBeenCalled();
    });
  });

  describe('clickDeleteTask()', () => {
    let openDialogSpy: jest.SpyInstance;
    const taskToDelete = {
      id: 1,
      name: 'test',
      eduContentAmount: 0,
      assignees: [new AssigneeFixture()]
    };

    beforeEach(() => {
      openDialogSpy = matDialog.open = jest.fn();
    });

    it('should open a confirmation dialog', () => {
      const mockDialogRef = {
        afterClosed: () => of(false),
        close: null
      } as MatDialogRef<ConfirmationModalComponent>;
      openDialogSpy.mockReturnValue(mockDialogRef);

      component.clickDeleteTask(taskToDelete);

      expect(openDialogSpy).toHaveBeenCalledTimes(1);
      expect(openDialogSpy).toHaveBeenCalledWith(ConfirmationModalComponent, {
        data: {
          title: 'Taak verwijderen',
          message: 'Ben je zeker dat je de geselecteerde taak wil verwijderen?'
        }
      });
    });

    it('should call vm.removeTasks when the user confirms', () => {
      const removeTaskSpy = jest.spyOn(viewModel, 'removeTasks');

      const mockDialogRef = {
        afterClosed: () => of(true), // fake confirmation
        close: null
      } as MatDialogRef<ConfirmationModalComponent>;
      openDialogSpy.mockReturnValue(mockDialogRef);

      component.clickDeleteTask(taskToDelete);

      expect(removeTaskSpy).toHaveBeenCalledTimes(1);
      expect(removeTaskSpy).toHaveBeenCalledWith([taskToDelete], true);
    });

    it('should not call vm.removeTasks when the user cancels', () => {
      const removeTaskSpy = jest.spyOn(viewModel, 'removeTasks');

      const mockDialogRef = {
        afterClosed: () => of(false), // fake cancel
        close: null
      } as MatDialogRef<ConfirmationModalComponent>;
      openDialogSpy.mockReturnValue(mockDialogRef);

      component.clickDeleteTask(taskToDelete);

      expect(removeTaskSpy).not.toHaveBeenCalled();
    });
  });

  describe('openNewTaskDialog()', () => {
    const afterClosed: BehaviorSubject<any> = new BehaviorSubject(null);
    const mockFormData: NewTaskFormValues = {
      title: 'Abc',
      learningArea: new LearningAreaFixture(),
      type: 'digital'
    };

    beforeEach(() => {
      jest.spyOn(matDialog, 'open').mockImplementation(() => {
        return {
          afterClosed: () => afterClosed
        } as any;
      });
    });

    it('should open a MatDialog with the correct data', () => {
      const allowedLearningAreas = [
        new LearningAreaFixture({ id: 1, name: 'wiskunde' }),
        new LearningAreaFixture({ id: 2, name: 'frans' })
      ];
      (viewModel.selectableLearningAreas$ as BehaviorSubject<
        LearningAreaInterface[]
      >).next(allowedLearningAreas);

      component.openNewTaskDialog();

      expect(matDialog.open).toHaveBeenCalledWith(NewTaskComponent, {
        data: {
          learningAreas: allowedLearningAreas
        },
        panelClass: 'pages-kabas-tasks-new-task__dialog'
      });
    });

    it('should navigate back to the overview if there is no formData in the dialog result', fakeAsync(() => {
      jest.spyOn(router, 'navigate');

      afterClosed.next(null);
      component.openNewTaskDialog();

      expect(router.navigate).toHaveBeenCalledWith(['tasks', 'manage'], {
        queryParams: { tab: 0 }
      });
    }));

    it('should pass new task data to the viewmodel if there was formData in the dialog result', () => {
      jest.spyOn(viewModel, 'createTask');

      afterClosed.next(mockFormData);
      component.openNewTaskDialog();

      expect(viewModel.createTask).toHaveBeenCalledWith(
        mockFormData.title,
        mockFormData.learningArea.id,
        mockFormData.type
      );
    });
  });

  describe('sidepanel content', () => {
    it('should show the task info in the sidepanel when selection is empty', () => {
      component.selectedContents$.next([]);
      fixture.detectChanges();

      const taskInfoDE = fixture.debugElement.query(
        By.css('[data-cy="task-title"]')
      );
      const eduContentInfoDE = fixture.debugElement.queryAll(
        By.css('[data-cy="educontent-detail"]')
      );

      expect(taskInfoDE).toBeTruthy();
      expect(eduContentInfoDE.length).toBe(0);
    });

    it('should show the educontent info in the sidepanel when there is a selection', () => {
      component.selectedContents$.next([
        createTaskEduContent(1),
        createTaskEduContent(2)
      ]);
      fixture.detectChanges();

      const taskInfoDE = fixture.debugElement.query(
        By.css('[data-cy="task-title"]')
      );
      const eduContentInfoDE = fixture.debugElement.queryAll(
        By.css('[data-cy="educontent-detail"]')
      );

      expect(taskInfoDE).toBeFalsy();
      expect(eduContentInfoDE.length).toBe(2);
    });

    describe('links', () => {
      const getSideBarLinks = () =>
        fixture.debugElement.queryAll(
          By.css('.manage-kabas-tasks-detail__info__link')
        );

      describe('paper task', () => {
        beforeEach(() => {
          currentTask.isPaperTask = true;
          updateCurrentTask(currentTask);
        });

        describe('link: Afdrukken met namen', () => {
          let link: DebugElement;

          beforeEach(() => {
            link = getSideBarLinks()[0];
          });

          it('should show the correct text', () => {
            const linkText = link.nativeElement.textContent.trim();
            const expected = 'Afdrukken met namen';
            expect(linkText).toEqual(expected);
          });

          it('should be disabled when there are no assignees', () => {
            currentTask.assignees = [];
            updateCurrentTask(currentTask);

            expect(link.nativeElement.classList).toContain(
              'manage-kabas-tasks-detail__info__link--disabled'
            );
          });

          it('should have a tooltip when there are no assignees', () => {
            currentTask.assignees = [];
            updateCurrentTask(currentTask);

            const tooltip: MatTooltip = link.injector.get<MatTooltip>(
              MatTooltip
            );

            expect(tooltip.message).toBe('Deze taak is aan niemand toegekend.');
          });

          it('should call the correct handler', () => {
            component.printTask = jest.fn();
            link.triggerEventHandler('click', null);

            expect(component.printTask).toHaveBeenCalledWith(currentTask, true);
          });
        });

        describe('link: Afdrukken zonder namen', () => {
          let link: DebugElement;

          beforeEach(() => {
            link = getSideBarLinks()[1];
          });

          it('should show the correct text', () => {
            const linkText = link.nativeElement.textContent.trim();
            const expected = 'Afdrukken zonder namen';
            expect(linkText).toEqual(expected);
          });

          it('should call the correct handler', () => {
            component.printTask = jest.fn();
            link.triggerEventHandler('click', null);

            expect(component.printTask).toHaveBeenCalledWith(
              currentTask,
              false
            );
          });
        });

        describe('link: Correctiesleutel afdrukken', () => {
          let link: DebugElement;

          beforeEach(() => {
            link = getSideBarLinks()[2];
          });

          it('should show the correct text', () => {
            const linkText = link.nativeElement.textContent.trim();
            const expected = 'Correctiesleutel afdrukken';
            expect(linkText).toEqual(expected);
          });

          it('should call the correct handler', () => {
            component.printSolution = jest.fn();
            link.triggerEventHandler('click', null);

            expect(component.printSolution).toHaveBeenCalledWith(
              jasmine.objectContaining(currentTask)
            );
          });
        });
      });
    });
  });

  describe('update actions', () => {
    it('should update title when text changed', () => {
      const titleComponent = fixture.debugElement.query(
        By.css('.manage-kabas-tasks-detail__info__title')
      );

      const newText = 'You are more than who you were';

      spyOn(component, 'updateTitle');
      titleComponent.componentInstance.textChanged.emit(newText);

      expect(component.updateTitle).toHaveBeenCalled();
      expect(component.updateTitle).toHaveBeenCalledWith(
        titleComponent.componentInstance.relatedItem,
        newText
      );
    });

    it('should update description when text changed', () => {
      const descriptionComponent = fixture.debugElement.query(
        By.css('.manage-kabas-tasks-detail__info__description')
      );

      const newText = "Time isn't the main thing. It's the only thing.";

      spyOn(component, 'updateDescription');

      descriptionComponent.componentInstance.textChanged.emit(newText);

      expect(component.updateDescription).toHaveBeenCalled();
      expect(component.updateDescription).toHaveBeenCalledWith(
        descriptionComponent.componentInstance.relatedItem,
        newText
      );
    });
  });

  describe('removeAssignee', () => {
    it('should remove the assignee', () => {
      viewModel.updateTaskAccess = jest.fn();
      const [assigneeToRemove, ...remainingAssignees] = currentTask.assignees;

      component.removeAssignee(currentTask, assigneeToRemove);
      expect(viewModel.updateTaskAccess).toHaveBeenCalledWith(
        currentTask,
        remainingAssignees
      );
    });
  });

  describe('reordering', () => {
    beforeEach(() => {
      component.isReordering = false;
    });

    it('it should toggle isReordering', () => {
      component.toggleIsReordering();
      expect(component.isReordering).toBeTruthy();
      component.toggleIsReordering();
      expect(component.isReordering).toBeFalsy();
    });

    it('should update reorderableTaskEduContents$ when dropping element', () => {
      const event = { previousIndex: 2, currentIndex: 1 } as CdkDragDrop<
        TaskEduContentWithEduContentInterface[]
      >;
      const expected = [
        taskEduContents[0],
        taskEduContents[2],
        taskEduContents[1]
      ];

      component.dropTaskEduContent(taskEduContents, event);

      expect(component.reorderableTaskEduContents$).toBeObservable(
        hot('a', {
          a: expected
        })
      );
    });

    it('should call updateTaskEduContentsOrder and toggle the mode', () => {
      component.isReordering = true;
      spyOn(viewModel, 'updateTaskEduContentsOrder');

      component.saveOrder();

      expect(viewModel.updateTaskEduContentsOrder).toHaveBeenCalledWith(
        taskEduContents
      );
      expect(component.isReordering).toBeFalsy();
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      taskEduContents = [
        createTaskEduContent(1, 'oefening 1', false, 1, 1),
        createTaskEduContent(2, 'oefening 2', false, 2, 1),
        createTaskEduContent(3, 'huiswerk 1', true, 3, 2),
        createTaskEduContent(4, 'overhoring 1', true, 1, 1),
        createTaskEduContent(5, 'overhoring 2', true, 2, 2)
      ];

      updateCurrentTask({ ...currentTask, taskEduContents });
    });

    describe('task-edu-content list', () => {
      const getListOptions = (): MatListOption[] =>
        fixture.debugElement
          .queryAll(By.directive(MatListOption))
          .map(listOptionDE => listOptionDE.componentInstance);

      it('should show all items on init', () => {
        expect(component.filteredTaskEduContents$).toBeObservable(
          hot('a', { a: taskEduContents })
        );

        const listOptions = getListOptions();
        expect(listOptions.length).toBe(taskEduContents.length);
        listOptions.forEach((listOption, index) => {
          expect(listOption.value).toEqual(taskEduContents[index]);
        });
      });

      it('should show the filtered items', () => {
        //filter on required = true
        const searchFilterCriteria = [
          { values: [{ selected: true, data: { required: true } }] }
        ] as SearchFilterCriteriaInterface[];
        component.requiredFilterSelectionChanged(searchFilterCriteria);
        fixture.detectChanges();

        const expected = [
          taskEduContents[2],
          taskEduContents[3],
          taskEduContents[4]
        ];

        expect(component.filteredTaskEduContents$).toBeObservable(
          hot('a', { a: expected })
        );

        const listOptions = getListOptions();
        expect(listOptions.length).toBe(3);

        listOptions.forEach((listOption, index) => {
          expect(listOption.value).toEqual(expected[index]);
        });
      });
    });

    describe('filters', () => {
      describe('title filter', () => {
        it('should show the title filter', () => {
          const filter = fixture.debugElement.query(
            By.css('.manage-kabas-tasks-detail__filterbar__filter--title')
          );
          const mockEvent = { foo: 'bar' };
          component.searchTermFilterValueChanged = jest.fn();

          filter.triggerEventHandler('valueChange', mockEvent);

          expect(component.searchTermFilterValueChanged).toHaveBeenCalledWith(
            mockEvent
          );
        });

        it('should filter on title', () => {
          const filterService = TestBed.get(
            FILTER_SERVICE_TOKEN
          ) as FilterServiceInterface;
          const filterSpy = (filterService.matchFilters = jest
            .fn()
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(true) // only second taskEduContent matches filter
            .mockReturnValue(false));

          const searchTerm = 'foo';

          component.searchTermFilterValueChanged(searchTerm);

          const expected = [taskEduContents[1]];

          expect(filterSpy).toHaveBeenCalledTimes(taskEduContents.length);

          filterSpy.mock.calls.forEach((call, index) => {
            expect(call[0]).toEqual(taskEduContents[index]);
            expect(call[1]).toEqual({
              eduContent: {
                publishedEduContentMetadata: { title: searchTerm }
              }
            });
          });

          expect(component.filteredTaskEduContents$).toBeObservable(
            hot('a', { a: expected })
          );
        });
      });

      describe('required filter', () => {
        it('should show the required filter', () => {
          const filter = fixture.debugElement.query(
            By.css('.manage-kabas-tasks-detail__filterbar__filter--required')
          );
          const mockEvent = { foo: 'bar' };
          component.requiredFilterSelectionChanged = jest.fn();

          filter.triggerEventHandler('filterSelectionChange', mockEvent);

          expect(component.requiredFilterSelectionChanged).toHaveBeenCalledWith(
            mockEvent
          );
        });

        const testCases = [
          {
            case: 'only true',
            values: [
              { selected: true, data: { required: true } },
              { selected: false, data: { required: false } }
            ],
            expected: [2, 3, 4]
          },
          {
            case: 'only false',
            values: [
              { selected: false, data: { required: true } },
              { selected: true, data: { required: false } }
            ],
            expected: [0, 1]
          },
          {
            case: 'both',

            values: [
              { selected: true, data: { required: true } },
              { selected: true, data: { required: false } }
            ],
            expected: [0, 1, 2, 3, 4]
          },
          {
            case: 'none',
            values: [
              { selected: false, data: { required: true } },
              { selected: false, data: { required: false } }
            ],
            expected: [0, 1, 2, 3, 4]
          }
        ];

        testCases.forEach(testCase => {
          it('should filter on required - ' + testCase.case, () => {
            const values = testCase.values;
            component.requiredFilterSelectionChanged([
              ({ values } as any) as SearchFilterCriteriaInterface
            ]);

            const expected = testCase.expected.map(
              index => taskEduContents[index]
            );

            expect(component.filteredTaskEduContents$).toBeObservable(
              hot('a', { a: expected })
            );
          });
        });
      });

      describe('diabolo-phase filter', () => {
        it('should show the diabolo-phase filter', () => {
          const filter = fixture.debugElement.query(
            By.css(
              '.manage-kabas-tasks-detail__filterbar__filter--diabolo-phase'
            )
          );
          const mockEvent = { foo: 'bar' };
          component.diaboloPhaseFilterSelectionChanged = jest.fn();

          filter.triggerEventHandler('filterSelectionChange', mockEvent);

          expect(
            component.diaboloPhaseFilterSelectionChanged
          ).toHaveBeenCalledWith(mockEvent);
        });

        const testCases = [
          {
            case: 'single value',
            values: [
              { selected: true, data: { id: 1 } },
              { selected: false, data: { id: 2 } },
              { selected: false, data: { id: 3 } }
            ],
            expected: [0, 3]
          },
          {
            case: 'multiple values',
            values: [
              { selected: false, data: { id: 1 } },
              { selected: true, data: { id: 2 } },
              { selected: true, data: { id: 3 } }
            ],
            expected: [1, 2, 4]
          },
          {
            case: 'all values',

            values: [
              { selected: true, data: { id: 1 } },
              { selected: true, data: { id: 2 } },
              { selected: true, data: { id: 3 } }
            ],
            expected: [0, 1, 2, 3, 4]
          },
          {
            case: 'none',
            values: [
              { selected: false, data: { id: 1 } },
              { selected: false, data: { id: 2 } },
              { selected: false, data: { id: 3 } }
            ],
            expected: [0, 1, 2, 3, 4]
          }
        ];

        testCases.forEach(testCase => {
          it('should filter on diaboloPhase - ' + testCase.case, () => {
            const values = testCase.values;
            component.diaboloPhaseFilterSelectionChanged([
              ({ values } as any) as SearchFilterCriteriaInterface
            ]);

            const expected = testCase.expected.map(
              index => taskEduContents[index]
            );

            expect(component.filteredTaskEduContents$).toBeObservable(
              hot('a', { a: expected })
            );
          });
        });
      });

      describe('level filter', () => {
        it('should show the level filter', () => {
          const filter = fixture.debugElement.query(
            By.css('.manage-kabas-tasks-detail__filterbar__filter--level')
          );
          const mockEvent = { foo: 'bar' };
          component.levelFilterSelectionChanged = jest.fn();

          filter.triggerEventHandler('filterSelectionChange', mockEvent);

          expect(component.levelFilterSelectionChanged).toHaveBeenCalledWith(
            mockEvent
          );
        });

        const testCases = [
          {
            case: 'only 1',
            values: [
              { selected: true, data: { level: 1 } },
              { selected: false, data: { level: 2 } }
            ],
            expected: [0, 1, 3]
          },
          {
            case: 'only 2',
            values: [
              { selected: false, data: { level: 1 } },
              { selected: true, data: { level: 2 } }
            ],
            expected: [2, 4]
          },
          {
            case: 'both',
            values: [
              { selected: true, data: { level: 1 } },
              { selected: true, data: { level: 2 } }
            ],
            expected: [0, 1, 2, 3, 4]
          },
          {
            case: 'none',
            values: [
              { selected: false, data: { level: 1 } },
              { selected: false, data: { level: 2 } }
            ],
            expected: [0, 1, 2, 3, 4]
          }
        ];

        testCases.forEach(testCase => {
          it('should filter on level - ' + testCase.case, () => {
            const values = testCase.values;
            component.levelFilterSelectionChanged([
              ({ values } as any) as SearchFilterCriteriaInterface
            ]);

            const expected = testCase.expected.map(
              index => taskEduContents[index]
            );

            expect(component.filteredTaskEduContents$).toBeObservable(
              hot('a', { a: expected })
            );
          });
        });
      });

      describe('reset-filters button', () => {
        it('should show a reset-filters button', () => {
          const filter = fixture.debugElement.query(
            By.css('.manage-kabas-tasks-detail__filterbar__reset-filters')
          );
          component.clickResetFilters = jest.fn();

          filter.triggerEventHandler('click', null);

          expect(component.clickResetFilters).toHaveBeenCalled();
        });

        it('should reset the filters', () => {
          const filters = fixture.debugElement
            .queryAll(By.css('.manage-kabas-tasks-detail__filterbar__filter'))
            .map(
              filterDE => filterDE.componentInstance
            ) as SearchFilterComponentInterface[];

          const filterResetSpies = [];
          filters.forEach(searchFilter => {
            filterResetSpies.push((searchFilter.reset = jest.fn()));
          });

          component.clickResetFilters();

          filterResetSpies.forEach(spy =>
            expect(spy).toHaveBeenCalledWith(false)
          );
        });

        it('should clear the filters on the list items', () => {
          const searchFilterCriteria = [
            { values: [{ selected: true, data: { required: true } }] }
          ] as SearchFilterCriteriaInterface[];
          component.requiredFilterSelectionChanged(searchFilterCriteria);

          component.clickResetFilters();

          expect(component.filteredTaskEduContents$).toBeObservable(
            hot('a', { a: taskEduContents })
          );
        });
      });
    });
  });
});

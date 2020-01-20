import { TestBed } from '@angular/core/testing';
import {
  ClassGroupActions,
  ClassGroupFixture,
  ClassGroupReducer,
  DalState,
  FavoriteActions,
  FavoriteFixture,
  FavoriteReducer,
  FavoriteTypesEnum,
  getStoreModuleForFeatures,
  GroupActions,
  GroupFixture,
  GroupReducer,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaReducer,
  LinkedPersonActions,
  LinkedPersonReducer,
  MethodActions,
  MethodFixture,
  MethodReducer,
  PersonFixture,
  TaskActions,
  TaskClassGroupActions,
  TaskClassGroupFixture,
  TaskClassGroupReducer,
  TaskEduContentActions,
  TaskEduContentFixture,
  TaskEduContentReducer,
  TaskFixture,
  TaskGroupActions,
  TaskGroupFixture,
  TaskGroupReducer,
  TaskReducer,
  TaskStudentActions,
  TaskStudentFixture,
  TaskStudentReducer
} from '@campus/dal';
import { MockDate } from '@campus/testing';
import { routerReducer } from '@ngrx/router-store';
import { Action, select, Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { AssigneeTypesEnum } from '../interfaces/Assignee.interface';
import {
  allowedLearningAreas,
  getTasksWithAssignments
} from './kabas-tasks.viewmodel.selectors';

describe('Kabas-tasks viewmodel selectors', () => {
  const dateMock = new MockDate();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          { router: routerReducer },
          {
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false
            }
          }
        ),
        ...getStoreModuleForFeatures([
          ClassGroupReducer,
          GroupReducer,
          LearningAreaReducer,
          LinkedPersonReducer,
          TaskEduContentReducer,
          TaskReducer,
          TaskClassGroupReducer,
          TaskGroupReducer,
          TaskStudentReducer,
          MethodReducer,
          FavoriteReducer
        ])
      ],
      providers: [Store]
    });
  });

  afterAll(() => {
    dateMock.returnRealDate();
  });

  describe('Store', () => {
    let store: Store<DalState>;
    const date = new Date().getTime();

    beforeEach(() => {
      store = TestBed.get(Store);
      hydrateStore(store, date);
    });

    it('should return digital tasksWithAssignments', () => {
      const stream = store.pipe(
        select(getTasksWithAssignments, {
          isPaper: false,
          type: FavoriteTypesEnum.TASK
        })
      );

      const expected = [
        {
          ...new TaskFixture({
            id: 1,
            name: 'een digitale taak',
            isFavorite: false
          }),
          eduContentAmount: 3,
          taskEduContents: [
            new TaskEduContentFixture({ id: 123, taskId: 1, eduContentId: 1 }),
            new TaskEduContentFixture({ id: 456, taskId: 1, eduContentId: 2 }),
            new TaskEduContentFixture({ id: 789, taskId: 1, eduContentId: 3 })
          ],
          learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
          startDate: new Date(date - 3),
          endDate: new Date(date + 3),
          status: 'active',
          assignees: [
            {
              type: AssigneeTypesEnum.CLASSGROUP,
              id: 1,
              label: '1A',
              start: new Date(date - 2),
              end: new Date(date + 2)
            },
            {
              type: AssigneeTypesEnum.GROUP,
              id: 1,
              label: 'Remediëring 2c',
              start: new Date(date - 1),
              end: new Date(date + 1)
            },
            {
              type: AssigneeTypesEnum.STUDENT,
              id: 1,
              label: 'Polleke Enkeltje',
              start: new Date(date - 3),
              end: new Date(date + 3)
            }
          ]
        },
        {
          ...new TaskFixture({
            id: 3,
            name: 'een taak zonder assignees of content',
            isFavorite: false
          }),
          eduContentAmount: 0,
          learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
          startDate: undefined,
          endDate: undefined,
          status: 'finished',
          assignees: []
        }
      ];
      expect(stream).toBeObservable(hot('a', { a: expected }));
    });

    it('should return paper tasksWithAssignments', () => {
      const stream = store.pipe(
        select(getTasksWithAssignments, {
          isPaper: true,
          type: FavoriteTypesEnum.TASK
        })
      );

      const expected = [
        {
          ...new TaskFixture({
            id: 2,
            name: 'een taak op dode bomen',
            isPaperTask: true,
            isFavorite: true
          }),
          eduContentAmount: 1,
          taskEduContents: [
            new TaskEduContentFixture({ id: 666, taskId: 2, eduContentId: 3 })
          ],
          learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
          startDate: new Date(date - 33),
          endDate: new Date(date + 33),
          status: 'active',
          assignees: [
            {
              type: AssigneeTypesEnum.CLASSGROUP,
              id: 2,
              label: '2c',
              start: new Date(date - 22),
              end: new Date(date + 22)
            },
            {
              type: AssigneeTypesEnum.GROUP,
              id: 2,
              label: 'Frederic Gryspeerdt fanclub',
              start: new Date(date - 11),
              end: new Date(date + 11)
            },
            {
              type: AssigneeTypesEnum.STUDENT,
              id: 2,
              label: 'Mieke Mokke',
              start: new Date(date - 33),
              end: new Date(date + 33)
            }
          ]
        }
      ];
      expect(stream).toBeObservable(hot('a', { a: expected }));
    });

    it('should return allowedLearningAreas', () => {
      const stream = store.pipe(select(allowedLearningAreas));

      const expected = [
        new LearningAreaFixture({ id: 2, name: 'frans' }),
        new LearningAreaFixture({ id: 1, name: 'wiskunde' })
      ];

      expect(stream).toBeObservable(
        hot('a', {
          a: expected
        })
      );
    });
  });
});

function hydrateStore(store, date) {
  const actions: Action[] = [
    getLoadTasksAction(),
    getLoadLearningAreasAction(),
    getLoadClassGroupsAction(),
    getLoadTaskEduContentsAction(),
    getLoadGroupsAction(),
    getLoadLinkedPersonsAction(),
    getLoadTaskClassGroupsAction(date),
    getLoadTaskGroupsAction(date),
    getLoadTaskStudentsAction(date),
    getLoadMethodsAction(),
    getLoadAllowedMethodsAction(),
    getLoadFavoritesAction()
  ];
  actions.forEach(action => store.dispatch(action));
}

function getLoadFavoritesAction() {
  return new FavoriteActions.FavoritesLoaded({
    favorites: [
      new FavoriteFixture({ type: FavoriteTypesEnum.TASK, taskId: 2 })
    ]
  });
}

function getLoadTasksAction() {
  return new TaskActions.TasksLoaded({
    tasks: [
      new TaskFixture({ id: 1, name: 'een digitale taak' }),
      new TaskFixture({
        id: 2,
        name: 'een taak op dode bomen',
        isPaperTask: true
      }),
      new TaskFixture({
        id: 3,
        name: 'een taak zonder assignees of content'
      })
    ]
  });
}

function getLoadLearningAreasAction() {
  return new LearningAreaActions.LearningAreasLoaded({
    learningAreas: [
      new LearningAreaFixture({ id: 1, name: 'wiskunde' }),
      new LearningAreaFixture({ id: 2, name: 'frans' }),
      new LearningAreaFixture({ id: 3, name: 'nederlands' })
    ]
  });
}

function getLoadMethodsAction() {
  return new MethodActions.MethodsLoaded({
    methods: [
      new MethodFixture({ id: 1, name: 'Hon³', learningAreaId: 2 }),
      new MethodFixture({ id: 2, name: 'Baguette', learningAreaId: 2 }),
      new MethodFixture({
        id: 3,
        name: 'Drie maal drie is negen',
        learningAreaId: 1
      })
    ]
  });
}

function getLoadAllowedMethodsAction() {
  return new MethodActions.AllowedMethodsLoaded({
    methodIds: [1, 2, 3]
  });
}

function getLoadClassGroupsAction() {
  return new ClassGroupActions.ClassGroupsLoaded({
    classGroups: [
      new ClassGroupFixture({ id: 1, name: '1A' }),
      new ClassGroupFixture({ id: 2, name: '2c' })
    ]
  });
}
function getLoadTaskEduContentsAction() {
  return new TaskEduContentActions.TaskEduContentsLoaded({
    taskEduContents: [
      new TaskEduContentFixture({ id: 123, taskId: 1, eduContentId: 1 }),
      new TaskEduContentFixture({ id: 456, taskId: 1, eduContentId: 2 }),
      new TaskEduContentFixture({ id: 789, taskId: 1, eduContentId: 3 }),
      new TaskEduContentFixture({ id: 666, taskId: 2, eduContentId: 3 })
    ]
  });
}
function getLoadGroupsAction() {
  return new GroupActions.GroupsLoaded({
    groups: [
      new GroupFixture({ id: 1 }),
      new GroupFixture({ id: 2, name: 'Frederic Gryspeerdt fanclub' })
    ]
  });
}
function getLoadLinkedPersonsAction() {
  return new LinkedPersonActions.LinkedPersonsLoaded({
    persons: [
      new PersonFixture({
        id: 1,
        name: 'Polleke',
        displayName: 'Polleke Enkeltje'
      }),
      new PersonFixture({ id: 2, name: 'Mieke', displayName: 'Mieke Mokke' })
    ]
  });
}
function getLoadTaskGroupsAction(date) {
  return TaskGroupActions.taskGroupsLoaded({
    taskGroups: [
      new TaskGroupFixture({
        id: 1,
        taskId: 1,
        groupId: 1,
        start: new Date(date - 1),
        end: new Date(date + 1)
      }),
      new TaskGroupFixture({
        id: 2,
        taskId: 2,
        groupId: 2,
        start: new Date(date - 11),
        end: new Date(date + 11)
      })
    ]
  });
}
function getLoadTaskClassGroupsAction(date) {
  return TaskClassGroupActions.taskClassGroupsLoaded({
    taskClassGroups: [
      new TaskClassGroupFixture({
        id: 1,
        taskId: 1,
        classGroupId: 1,
        start: new Date(date - 2),
        end: new Date(date + 2)
      }),
      new TaskClassGroupFixture({
        id: 2,
        taskId: 2,
        classGroupId: 2,
        start: new Date(date - 22),
        end: new Date(date + 22)
      })
    ]
  });
}
function getLoadTaskStudentsAction(date) {
  return TaskStudentActions.taskStudentsLoaded({
    taskStudents: [
      new TaskStudentFixture({
        id: 1,
        taskId: 1,
        personId: 1,
        start: new Date(date - 3),
        end: new Date(date + 3)
      }),
      new TaskStudentFixture({
        id: 2,
        taskId: 2,
        personId: 2,
        start: new Date(date - 33),
        end: new Date(date + 33)
      })
    ]
  });
}

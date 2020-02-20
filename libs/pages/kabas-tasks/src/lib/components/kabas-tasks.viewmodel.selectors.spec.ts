import { TestBed } from '@angular/core/testing';
import {
  ClassGroupActions,
  ClassGroupFixture,
  ClassGroupReducer,
  DalState,
  DiaboloPhaseActions,
  DiaboloPhaseFixture,
  DiaboloPhaseReducer,
  EduContent,
  EduContentActions,
  EduContentFixture,
  EduContentReducer,
  FavoriteActions,
  FavoriteFixture,
  FavoriteInterface,
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
  MethodLevelActions,
  MethodLevelFixture,
  MethodLevelReducer,
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
  TaskInterface,
  TaskReducer,
  TaskStudentActions,
  TaskStudentFixture,
  TaskStudentReducer
} from '@campus/dal';
import { MockDate } from '@campus/testing';
import { Dictionary } from '@ngrx/entity';
import { routerReducer } from '@ngrx/router-store';
import { Action, select, Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { AssigneeTypesEnum } from '../interfaces/Assignee.interface';
import {
  allowedLearningAreas,
  getAllTasksWithAssignments,
  getTaskFavoriteBookIds,
  getTasksWithAssignmentsByType,
  getTaskWithAssignmentAndEduContents
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
          FavoriteReducer,
          DiaboloPhaseReducer,
          MethodLevelReducer,
          EduContentReducer
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
        select(getTasksWithAssignmentsByType, {
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
            {
              ...new TaskEduContentFixture({
                id: 789,
                index: 1,
                taskId: 1,
                eduContentId: 3
              }),
              eduContent: {}
            },
            {
              ...new TaskEduContentFixture({
                id: 456,
                index: 2,
                taskId: 1,
                eduContentId: 2
              }),
              eduContent: {}
            },
            {
              ...new TaskEduContentFixture({
                id: 123,
                index: 3,
                taskId: 1,
                eduContentId: 1
              }),
              eduContent: {}
            }
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
              end: new Date(date + 2),
              relationId: 1
            },
            {
              type: AssigneeTypesEnum.GROUP,
              id: 1,
              label: 'Remediëring 2c',
              start: new Date(date - 1),
              end: new Date(date + 1),
              relationId: 1
            },
            {
              type: AssigneeTypesEnum.STUDENT,
              id: 1,
              label: 'Polleke Enkeltje',
              start: new Date(date - 3),
              end: new Date(date + 3),
              relationId: 1
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
          taskEduContents: [],
          learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
          startDate: undefined,
          endDate: undefined,
          status: 'pending',
          assignees: []
        }
      ];
      expect(stream).toBeObservable(hot('a', { a: expected }));
    });

    it('should return paper tasksWithAssignments', () => {
      const stream = store.pipe(
        select(getTasksWithAssignmentsByType, {
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
            new TaskEduContentFixture({
              id: 666,
              index: 6,
              taskId: 2,
              eduContentId: 3,
              eduContent: {} as EduContent
            })
          ],
          learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
          startDate: new Date(date - 33),
          endDate: new Date(date + 33),
          status: 'active',
          assignees: [
            {
              id: 2,
              type: AssigneeTypesEnum.CLASSGROUP,
              relationId: 2,
              label: '2c',
              start: new Date(date - 22),
              end: new Date(date + 22)
            },
            {
              id: 2,
              type: AssigneeTypesEnum.GROUP,
              relationId: 2,
              label: 'Frederic Gryspeerdt fanclub',
              start: new Date(date - 11),
              end: new Date(date + 11)
            },
            {
              id: 2,
              type: AssigneeTypesEnum.STUDENT,
              relationId: 2,
              label: 'Mieke Mokke',
              start: new Date(date - 33),
              end: new Date(date + 33)
            }
          ]
        }
      ];
      expect(stream).toBeObservable(hot('a', { a: expected }));
    });

    it('should return all tasksWithAssignments', () => {
      const stream = store.pipe(
        select(getAllTasksWithAssignments, {
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
            new TaskEduContentFixture({
              id: 789,
              index: 1,
              taskId: 1,
              eduContentId: 3,
              eduContent: {} as EduContent
            }),
            new TaskEduContentFixture({
              id: 456,
              index: 2,
              taskId: 1,
              eduContentId: 2,
              eduContent: {} as EduContent
            }),
            new TaskEduContentFixture({
              id: 123,
              index: 3,
              taskId: 1,
              eduContentId: 1,
              eduContent: {} as EduContent
            })
          ],
          learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
          startDate: new Date(date - 3),
          endDate: new Date(date + 3),
          status: 'active',
          assignees: [
            {
              id: 1,
              type: AssigneeTypesEnum.CLASSGROUP,
              relationId: 1,
              label: '1A',
              start: new Date(date - 2),
              end: new Date(date + 2)
            },
            {
              id: 1,
              type: AssigneeTypesEnum.GROUP,
              relationId: 1,
              label: 'Remediëring 2c',
              start: new Date(date - 1),
              end: new Date(date + 1)
            },
            {
              id: 1,
              type: AssigneeTypesEnum.STUDENT,
              relationId: 1,
              label: 'Polleke Enkeltje',
              start: new Date(date - 3),
              end: new Date(date + 3)
            }
          ]
        },
        {
          ...new TaskFixture({
            id: 2,
            name: 'een taak op dode bomen',
            isPaperTask: true,
            isFavorite: true
          }),
          eduContentAmount: 1,
          taskEduContents: [
            new TaskEduContentFixture({
              id: 666,
              index: 6,
              taskId: 2,
              eduContentId: 3,
              eduContent: {} as EduContent
            })
          ],
          learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
          startDate: new Date(date - 33),
          endDate: new Date(date + 33),
          status: 'active',
          assignees: [
            {
              id: 2,
              type: AssigneeTypesEnum.CLASSGROUP,
              relationId: 2,
              label: '2c',
              start: new Date(date - 22),
              end: new Date(date + 22)
            },
            {
              id: 2,
              type: AssigneeTypesEnum.GROUP,
              relationId: 2,
              label: 'Frederic Gryspeerdt fanclub',
              start: new Date(date - 11),
              end: new Date(date + 11)
            },
            {
              id: 2,
              type: AssigneeTypesEnum.STUDENT,
              relationId: 2,
              label: 'Mieke Mokke',
              start: new Date(date - 33),
              end: new Date(date + 33)
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
          taskEduContents: [],
          learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
          startDate: undefined,
          endDate: undefined,
          status: 'pending',
          assignees: []
        }
      ];

      expect(stream).toBeObservable(hot('a', { a: expected }));
    });

    it('should return a task with assignments and eduContents', () => {
      const stream = store.pipe(
        select(getTaskWithAssignmentAndEduContents, {
          taskId: 1,
          type: FavoriteTypesEnum.TASK
        })
      );

      const expected = {
        ...new TaskFixture({
          id: 1,
          name: 'een digitale taak',
          isFavorite: false
        }),
        eduContentAmount: 3,
        taskEduContents: [
          new TaskEduContentFixture({
            id: 789,
            index: 1,
            taskId: 1,
            eduContentId: 3,
            eduContent: new EduContentFixture(
              { id: 3 },
              {
                methodIds: [1, 2],
                methodLevel: new MethodLevelFixture({
                  label: 'Kikker',
                  levelId: 1,
                  methodId: 1
                })
              }
            )
          }),
          new TaskEduContentFixture({
            id: 456,
            index: 2,
            taskId: 1,
            eduContentId: 2,
            eduContent: new EduContentFixture(
              { id: 2 },
              {
                methodIds: [1, 2],
                methodLevel: new MethodLevelFixture({
                  label: 'Kikker',
                  levelId: 1,
                  methodId: 1
                })
              }
            )
          }),
          new TaskEduContentFixture({
            id: 123,
            index: 3,
            taskId: 1,
            eduContentId: 1,
            eduContent: new EduContentFixture(
              { id: 1 },
              {
                methodIds: [1, 2],
                methodLevel: new MethodLevelFixture({
                  label: 'Kikker',
                  levelId: 1,
                  methodId: 1
                })
              }
            )
          })
        ],
        learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
        startDate: new Date(date - 3),
        endDate: new Date(date + 3),
        status: 'active',
        assignees: [
          {
            id: 1,
            type: AssigneeTypesEnum.CLASSGROUP,
            relationId: 1,
            label: '1A',
            start: new Date(date - 2),
            end: new Date(date + 2)
          },
          {
            id: 1,
            type: AssigneeTypesEnum.GROUP,
            relationId: 1,
            label: 'Remediëring 2c',
            start: new Date(date - 1),
            end: new Date(date + 1)
          },
          {
            id: 1,
            type: AssigneeTypesEnum.STUDENT,
            relationId: 1,
            label: 'Polleke Enkeltje',
            start: new Date(date - 3),
            end: new Date(date + 3)
          }
        ]
      };

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

  describe('getTaskFavoriteBookIds', () => {
    const taskDict: Dictionary<TaskInterface> = {
      1: new TaskFixture({ id: 1, learningAreaId: 11 }),
      2: new TaskFixture({ id: 2, learningAreaId: 12 }),
      3: new TaskFixture({ id: 3, learningAreaId: 13 })
    };

    // boekes
    const eduContentDict: Dictionary<EduContent> = {
      1: new EduContentFixture(
        { id: 1 },
        { learningAreaId: 11, eduContentBookId: 123 }
      ),
      2: new EduContentFixture(
        { id: 2 },
        { learningAreaId: 12, eduContentBookId: 456 }
      ),
      3: new EduContentFixture( // not a favorite
        { id: 3 },
        { learningAreaId: 13, eduContentBookId: 789 }
      ),
      4: new EduContentFixture(
        { id: 4 },
        { learningAreaId: 11, eduContentBookId: 124 }
      )
    };

    const favoritesByType: { [key: string]: FavoriteInterface[] } = {
      [FavoriteTypesEnum.BOEKE]: [
        new FavoriteFixture({ eduContentId: 1 }), // boeke learningArea 11
        new FavoriteFixture({ eduContentId: 2 }), // boeke learningArea 12
        new FavoriteFixture({ eduContentId: 4 }) // boeke learningArea 11
      ]
    };

    const { projector } = getTaskFavoriteBookIds;

    it('should return multiple books', () => {
      const taskId = 1;
      const result = projector(taskDict, favoritesByType, eduContentDict, {
        taskId
      });

      const expected = [123, 124];

      expect(result).toEqual(expected);
    });

    it('should return 1 book', () => {
      const taskId = 2;
      const result = projector(taskDict, favoritesByType, eduContentDict, {
        taskId
      });

      const expected = [456];

      expect(result).toEqual(expected);
    });

    it('should return an empty array', () => {
      const taskId = 3;
      const result = projector(taskDict, favoritesByType, eduContentDict, {
        taskId
      });

      const expected = [];

      expect(result).toEqual(expected);
    });

    it('should return an empty array - no favorites', () => {
      const taskId = 1;
      const result = projector(
        taskDict,
        {}, // no favorites in store
        eduContentDict,
        { taskId }
      );

      const expected = [];

      expect(result).toEqual(expected);
    });

    it('should return an empty array - boeke not in store', () => {
      const taskId = 1;
      const result = projector(
        taskDict,
        favoritesByType,
        {}, // no eduContent in store
        { taskId }
      );

      const expected = [];

      expect(result).toEqual(expected);
    });
  });
});

function hydrateStore(store, date) {
  const actions: Action[] = [
    getLoadTasksAction(),
    getLoadLearningAreasAction(),
    getLoadClassGroupsAction(),
    getLoadEduContentsAction(),
    getLoadTaskEduContentsAction(),
    getLoadGroupsAction(),
    getLoadLinkedPersonsAction(),
    getLoadTaskClassGroupsAction(date),
    getLoadTaskGroupsAction(date),
    getLoadTaskStudentsAction(date),
    getLoadMethodsAction(),
    getLoadDiaboloPhasesAction(),
    getLoadMethodLevelsAction(),
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

function getLoadDiaboloPhasesAction() {
  return new DiaboloPhaseActions.DiaboloPhasesLoaded({
    diaboloPhases: [new DiaboloPhaseFixture()]
  });
}

function getLoadMethodLevelsAction() {
  return new MethodLevelActions.MethodLevelsLoaded({
    methodLevels: [
      new MethodLevelFixture({ label: 'Kikker', levelId: 1, methodId: 1 }),
      new MethodLevelFixture({ label: 'Knei', levelId: 2, methodId: 1 })
    ]
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
function getLoadEduContentsAction() {
  return new EduContentActions.EduContentsLoaded({
    eduContents: [
      new EduContentFixture({ id: 1 }, { methodIds: [1, 2] }),
      new EduContentFixture({ id: 2 }, { methodIds: [1, 2] }),
      new EduContentFixture({ id: 3 }, { methodIds: [1, 2] }),
      new EduContentFixture({ id: 4 }, { methodIds: [1, 2] })
    ]
  });
}
function getLoadTaskEduContentsAction() {
  return new TaskEduContentActions.TaskEduContentsLoaded({
    taskEduContents: [
      new TaskEduContentFixture({
        id: 123,
        index: 3,
        taskId: 1,
        eduContentId: 1
      }),
      new TaskEduContentFixture({
        id: 456,
        index: 2,
        taskId: 1,
        eduContentId: 2
      }),
      new TaskEduContentFixture({
        id: 789,
        index: 1,
        taskId: 1,
        eduContentId: 3
      }),
      new TaskEduContentFixture({
        id: 666,
        index: 6,
        taskId: 2,
        eduContentId: 3
      })
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

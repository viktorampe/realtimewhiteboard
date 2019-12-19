import { TestBed } from '@angular/core/testing';
import { ClassGroupActions, ClassGroupFixture, ClassGroupReducer, DalState, getStoreModuleForFeatures, GroupActions, GroupFixture, GroupReducer, LearningAreaActions, LearningAreaFixture, LearningAreaReducer, LinkedPersonActions, LinkedPersonReducer, PersonFixture, TaskActions, TaskClassGroupActions, TaskClassGroupFixture, TaskClassGroupReducer, TaskEduContentActions, TaskEduContentFixture, TaskEduContentReducer, TaskFixture, TaskGroupActions, TaskGroupFixture, TaskGroupReducer, TaskReducer, TaskStudentActions, TaskStudentFixture, TaskStudentReducer } from '@campus/dal';
import { routerReducer } from '@ngrx/router-store';
import { Action, select, Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { AssigneeTypesEnum } from '../interfaces/Assignee.interface';
import { getTasksWithAssignments } from './kabas-tasks.viewmodel.selectors';

describe('Kabas-tasks viewmodel selectors', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
                StoreModule.forRoot({router: routerReducer},{
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false
          }}),
        ...getStoreModuleForFeatures([
          ClassGroupReducer,
          GroupReducer,
          LearningAreaReducer,
          LinkedPersonReducer,
          TaskEduContentReducer,
          TaskReducer,
          TaskClassGroupReducer,
          TaskGroupReducer,
          TaskStudentReducer
        ])
      ],
      providers: [Store]
    });
  });

  describe('Store', () => {
    let store: Store<DalState>;
    const date = Date.now();

    beforeEach(() => {
      store = TestBed.get(Store);
      hydrateStore(store, date);
    });

    it('should return digital tasksWithAssignments', () => {
      const stream = store.pipe(
        select(getTasksWithAssignments, { isPaper: false })
      );

      const expected = [
        {
          ...new TaskFixture({ id: 1, name: 'een digitale taak' }),
          eduContentAmount: 3,
          learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
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
            name: 'een taak zonder assignees of content'
          }),
          eduContentAmount: 0,
          learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
          assignees: []
        }
      ];
      expect(stream).toBeObservable(hot('a', { a: expected }));
    });

    it('should return paper tasksWithAssignments', () => {
      const stream = store.pipe(
        select(getTasksWithAssignments, { isPaper: true })
      );

      const expected = [
        {
          ...new TaskFixture({
            id: 2,
            name: 'een taak op dode bomen',
            isPaperTask: true
          }),
          eduContentAmount: 1,
          learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
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
    getLoadTaskStudentsAction(date)
  ];
  actions.forEach(action => store.dispatch(action));
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
    learningAreas: [new LearningAreaFixture({ name: 'wiskunde' })]
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
  return new TaskGroupActions.TaskGroupsLoaded({
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
  return new TaskClassGroupActions.TaskClassGroupsLoaded({
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
  return new TaskStudentActions.TaskStudentsLoaded({
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

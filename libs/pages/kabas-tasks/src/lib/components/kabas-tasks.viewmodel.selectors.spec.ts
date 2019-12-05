import { TestBed } from '@angular/core/testing';
import {
  ClassGroupActions,
  ClassGroupFixture,
  ClassGroupReducer,
  DalState,
  getStoreModuleForFeatures,
  GroupActions,
  GroupFixture,
  GroupReducer,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaReducer,
  LinkedPersonActions,
  LinkedPersonReducer,
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
import { routerReducer } from '@ngrx/router-store';
import { Action, select, Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import {
  AssigneeType,
  getTasksWithAssignments
} from './kabas-tasks.viewmodel.selectors';

describe('Kabas-tasks viewmodel selectors', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ router: routerReducer }),
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

    beforeEach(() => {
      store = TestBed.get(Store);
      hydrateStore(store);
    });

    it('should use the data in the store', () => {
      const stream = store.pipe(
        select(getTasksWithAssignments, { isPaper: false })
      );

      const expected = {
        ...new TaskFixture(),
        eduContentAmount: 3,
        learningArea: new LearningAreaFixture({ name: 'wiskunde' }),
        assignees: [
          jasmine.objectContaining({
            type: AssigneeType.CLASSGROUP,
            label: '1A'
          }),
          jasmine.objectContaining({
            type: AssigneeType.GROUP,
            label: 'Remediëring 2c'
          }),
          jasmine.objectContaining({
            type: AssigneeType.STUDENT,
            label: 'Polleke'
          })
        ]
      };
      expect(stream).toBeObservable(hot('a', { a: [expected] }));
    });
  });

  describe('getTasksWithAssignments', () => {
    const projector: Function = getTasksWithAssignments.projector;
  });
});

function hydrateStore(store) {
  const actions: Action[] = [
    getLoadTasksAction(),
    getLoadLearningAreasAction(),
    getLoadClassGroupsAction(),
    getLoadTaskEduContentsAction(),
    getLoadGroupsAction(),
    getLoadLinkedPersonsAction(),
    getLoadTaskClassGroupsAction(),
    getLoadTaskGroupsAction(),
    getLoadTaskStudentsAction()
  ];
  actions.forEach(action => store.dispatch(action));
}

function getLoadTasksAction() {
  return new TaskActions.TasksLoaded({ tasks: [new TaskFixture()] });
}

function getLoadLearningAreasAction() {
  return new LearningAreaActions.LearningAreasLoaded({
    learningAreas: [new LearningAreaFixture({ name: 'wiskunde' })]
  });
}
function getLoadClassGroupsAction() {
  return new ClassGroupActions.ClassGroupsLoaded({
    classGroups: [new ClassGroupFixture()]
  });
}
function getLoadTaskEduContentsAction() {
  return new TaskEduContentActions.TaskEduContentsLoaded({
    taskEduContents: [
      new TaskEduContentFixture({ id: 123, taskId: 1, eduContentId: 1 }),
      new TaskEduContentFixture({ id: 456, taskId: 1, eduContentId: 2 }),
      new TaskEduContentFixture({ id: 789, taskId: 1, eduContentId: 3 })
    ]
  });
}
function getLoadGroupsAction() {
  return new GroupActions.GroupsLoaded({ groups: [new GroupFixture()] });
}
function getLoadLinkedPersonsAction() {
  return new LinkedPersonActions.LinkedPersonsLoaded({
    persons: [new PersonFixture({ name: 'Polleke' })]
  });
}
function getLoadTaskGroupsAction() {
  return new TaskGroupActions.TaskGroupsLoaded({
    taskGroups: [new TaskGroupFixture({ taskId: 1, groupId: 1 })]
  });
}
function getLoadTaskClassGroupsAction() {
  return new TaskClassGroupActions.TaskClassGroupsLoaded({
    taskClassGroups: [new TaskClassGroupFixture({ taskId: 1, classGroupId: 1 })]
  });
}
function getLoadTaskStudentsAction() {
  return new TaskStudentActions.TaskStudentsLoaded({
    taskStudents: [new TaskStudentFixture({ taskId: 1, personId: 1 })]
  });
}

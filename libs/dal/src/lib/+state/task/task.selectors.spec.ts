import { Dictionary } from '@ngrx/entity';
import { TaskQueries } from '.';
import {
  AssigneeFixture,
  EduContentFixture,
  LearningAreaFixture,
  TaskEduContentFixture,
  TaskWithAssigneesFixture
} from '../../+fixtures';
import { TaskFixture } from '../../+fixtures/Task.fixture';
import {
  FavoriteInterface,
  LearningAreaInterface,
  TaskEduContentInterface,
  TaskInterface
} from '../../+models';
import { AssigneeInterface } from './Assignee.interface';
import { AssigneeTypesEnum } from './AssigneeTypes.enum';
import { State } from './task.reducer';
import { TaskStatusEnum } from './TaskWithAssignees.interface';

describe('Task Selectors', () => {
  function createTask(id: number, teacherId: number): TaskInterface | any {
    return {
      id: id,
      personId: teacherId
    };
  }

  function createState(
    tasks: TaskInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: tasks ? tasks.map(task => task.id) : [],
      entities: tasks
        ? tasks.reduce(
            (entityMap, task) => ({
              ...entityMap,
              [task.id]: task
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let taskState: State;
  let storeState: any;

  describe('Task Selectors', () => {
    beforeEach(() => {
      taskState = createState(
        [
          createTask(4, 1),
          createTask(1, 1),
          createTask(2, 2),
          createTask(3, 2)
        ],
        true,
        'no error'
      );
      storeState = { tasks: taskState };
    });
    it('getError() should return the error', () => {
      const results = TaskQueries.getError(storeState);
      expect(results).toBe(taskState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = TaskQueries.getLoaded(storeState);
      expect(results).toBe(taskState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = TaskQueries.getAll(storeState);
      expect(results).toEqual([
        createTask(4, 1),
        createTask(1, 1),
        createTask(2, 2),
        createTask(3, 2)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = TaskQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = TaskQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = TaskQueries.getAllEntities(storeState);
      expect(results).toEqual(taskState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = TaskQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createTask(3, 2),
        createTask(1, 1),
        undefined,
        createTask(2, 2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = TaskQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createTask(2, 2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = TaskQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
    it('getShared() should return the tasks you do not own', () => {
      const results = TaskQueries.getShared(storeState, { userId: 1 });
      expect(results).toEqual([createTask(2, 2), createTask(3, 2)]);
    });
    it('getOwn() should return the tasks you own', () => {
      const results = TaskQueries.getOwn(storeState, { userId: 1 });
      expect(results).toEqual([createTask(4, 1), createTask(1, 1)]);
    });

    it('getSharedLearningAreaIds', () => {
      const results = TaskQueries.getSharedLearningAreaIds(
        {
          tasks: createState([
            new TaskFixture({ id: 1, personId: 3, learningAreaId: 1 }),
            new TaskFixture({ id: 2, personId: 3, learningAreaId: 2 }),
            new TaskFixture({ id: 3, learningAreaId: 1 })
          ])
        },
        { userId: 3 }
      );
      expect(results).toEqual(new Set([1]));
    });

    it('getSharedTaskIdsByLearningAreaId', () => {
      const results = TaskQueries.getSharedTaskIdsByLearningAreaId(
        {
          tasks: createState([
            new TaskFixture({ id: 1, personId: 3, learningAreaId: 1 }),
            new TaskFixture({ id: 2, personId: 3, learningAreaId: 2 }),
            new TaskFixture({ id: 3, learningAreaId: 1 })
          ])
        },
        { learningAreaId: 1, userId: 3 }
      );
      expect(results).toEqual([3]);
    });

    it('combinedAssigneesByTask', () => {
      const projector = TaskQueries.combinedAssigneesByTask.projector;
      const tCGA = {
        1: [
          new AssigneeFixture({
            id: 1, // taskClassGroupId
            type: AssigneeTypesEnum.CLASSGROUP
          }),
          new AssigneeFixture({
            id: 3,
            type: AssigneeTypesEnum.CLASSGROUP
          })
        ],
        2: [
          new AssigneeFixture({
            id: 2,
            type: AssigneeTypesEnum.CLASSGROUP
          })
        ]
      };
      const tGA = {
        1: [
          new AssigneeFixture({
            id: 1, // taskGroupId
            type: AssigneeTypesEnum.GROUP
          })
        ],
        2: [
          new AssigneeFixture({
            id: 2,
            type: AssigneeTypesEnum.GROUP
          })
        ]
      };
      const tSA = {
        1: [
          new AssigneeFixture({
            id: 1, // taskStudentId
            type: AssigneeTypesEnum.STUDENT
          })
        ],
        3: [
          new AssigneeFixture({
            id: 2,
            type: AssigneeTypesEnum.STUDENT
          })
        ]
      };

      expect(projector(tCGA, tGA, tSA, {})).toEqual({
        1: [...tCGA[1], ...tGA[1], ...tSA[1]],
        2: [...tCGA[2], ...tGA[2]],
        3: [...tSA[3]]
      });
    });

    it('getAllTasksWithAssignments', () => {
      const projector = TaskQueries.getAllTasksWithAssignments.projector;
      const tasks: TaskInterface[] = [
        new TaskFixture({ id: 1, learningAreaId: 1 }),
        new TaskFixture({ id: 2, learningAreaId: 1 }),
        new TaskFixture({ id: 3, learningAreaId: 1 })
      ];
      const learningAreaDict: Dictionary<LearningAreaInterface> = {
        1: new LearningAreaFixture({ id: 1 })
      };
      const taskEduContentByTask: Dictionary<TaskEduContentInterface[]> = {
        1: [
          new TaskEduContentFixture({
            id: 1,
            eduContent: new EduContentFixture()
          })
        ],
        2: [
          new TaskEduContentFixture({
            id: 2,
            eduContent: new EduContentFixture()
          })
        ],
        3: [
          new TaskEduContentFixture({
            id: 3,
            eduContent: new EduContentFixture()
          })
        ]
      };
      const assigneesByTask: Dictionary<AssigneeInterface[]> = {
        1: [new AssigneeFixture({ id: 1 })],
        2: [new AssigneeFixture({ id: 2 })],
        3: [new AssigneeFixture({ id: 3 })]
      };
      const favoriteTasks: FavoriteInterface[] = [];

      expect(
        projector(
          tasks,
          learningAreaDict,
          taskEduContentByTask,
          assigneesByTask,
          favoriteTasks
        )
      ).toEqual([
        resultForTask(tasks[0]),
        resultForTask(tasks[1]),
        resultForTask(tasks[2])
      ]);

      function resultForTask(task: TaskInterface): TaskWithAssigneesFixture {
        const assignees = assigneesByTask[task.id];
        const taskEduContents = taskEduContentByTask[task.id] || [];
        return new TaskWithAssigneesFixture({
          ...task,
          eduContentAmount: taskEduContents.length,
          taskEduContents: taskEduContents.map(taskEduContent => ({
            id: taskEduContent.id,
            index: taskEduContent.index,
            eduContent: taskEduContent.eduContent
          })),
          assignees,
          startDate: assignees[0].start,
          endDate: assignees[0].end,
          status: TaskStatusEnum.FINISHED,
          isFavorite: false,
          learningArea: learningAreaDict[task.learningAreaId]
        });
      }
    });
  });
});

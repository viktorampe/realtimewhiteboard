import { groupArrayByKey } from '@campus/utils';
import { Dictionary } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  EduContent,
  LearningAreaInterface,
  ResultInterface,
  TaskEduContentInterface,
  TaskInterface
} from '../../+models';
import { TaskInstance } from '../../+models/TaskInstance';
import { TaskInstanceInterface } from '../../+models/TaskInstance.interface';
import { EduContentQueries } from '../edu-content';
import { LearningAreaQueries } from '../learning-area';
import { ResultQueries } from '../result';
import { TaskQueries } from '../task';
import { TaskEduContentQueries } from '../task-edu-content';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './task-instance.reducer';

export const selectTaskInstanceState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectTaskInstanceState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectTaskInstanceState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectTaskInstanceState, selectAll);

export const getCount = createSelector(selectTaskInstanceState, selectTotal);

export const getIds = createSelector(selectTaskInstanceState, selectIds);

export const getAllEntities = createSelector(
  selectTaskInstanceState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * taskInstance$: TaskInstanceInterface[] = this.store.pipe(
    select(TaskInstanceQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectTaskInstanceState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => asTaskInstance(state.entities[id]));
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * taskInstance$: TaskInstanceInterface = this.store.pipe(
    select(TaskInstanceQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectTaskInstanceState,
  (state: State, props: { id: number }) =>
    asTaskInstance(state.entities[props.id])
);

/**
 * gets all taskInstances grouped by taskId
 */
export const getAllGroupedByTaskId = createSelector(
  selectTaskInstanceState,
  (state: State) => {
    return groupArrayByKey(
      Object.values(state.entities).map(asTaskInstance),
      'taskId'
    );
  }
);

/**
 * gets all taskInstances for a given taskId
 */
export const getAllByTaskId = createSelector(
  selectTaskInstanceState,
  (state: State, props: { taskId: number }) => {
    return (<number[]>state.ids)
      .filter(id => state.entities[id].taskId === props.taskId)
      .map(id => asTaskInstance(state.entities[id]));
  }
);

export const getActiveTaskIds = createSelector(
  selectTaskInstanceState,
  (state: State, props: { date: Date }) => {
    return new Set(
      (<number[]>state.ids).reduce(
        (acc, id) =>
          state.entities[id].end > props.date &&
          props.date > state.entities[id].start
            ? [...acc, state.entities[id].taskId]
            : acc,
        []
      )
    );
  }
);

export const getTaskInstanceWithTaskById = createSelector(
  [
    getById,
    TaskQueries.getAllEntities,
    ResultQueries.getResultsByTask,
    TaskEduContentQueries.getAllGroupedByTaskId,
    EduContentQueries.getAllEntities,
    LearningAreaQueries.getAllEntities
  ],
  (
    taskInstance: TaskInstance,
    taskDict: Dictionary<TaskInterface>,
    resultsByTask: Dictionary<ResultInterface[]>,
    taskEduContentByTask: Dictionary<TaskEduContentInterface[]>,
    eduContentDict: Dictionary<EduContent>,
    learningAreaDict: Dictionary<LearningAreaInterface>,
    props: { id: number }
  ) => {
    return {
      ...taskInstance,
      task: {
        ...taskDict[taskInstance.taskId],
        results: resultsByTask[taskInstance.taskId],
        taskEduContents: taskEduContentByTask[taskInstance.taskId].map(tE => ({
          ...tE,
          eduContent: eduContentDict[tE.eduContentId]
        })),
        learningArea:
          learningAreaDict[taskDict[taskInstance.taskId].learningAreaId]
      }
    };
  }
);

export const getTaskStudentTaskInstances = createSelector(
  [
    getAll,
    TaskQueries.getAllEntities,
    ResultQueries.getResultsByTask,
    TaskEduContentQueries.getAllGroupedByTaskId,
    LearningAreaQueries.getAllEntities
  ],
  (
    taskInstances: TaskInstanceInterface[],
    tasksById: Dictionary<TaskInterface>,
    resultsByTaskId: Dictionary<ResultInterface[]>,
    taskEduContentByTaskId: Dictionary<TaskEduContentInterface[]>,
    learningAreaById: Dictionary<LearningAreaInterface>
  ) => {
    return taskInstances.map(ti => {
      return {
        ...ti,
        task: {
          ...tasksById[ti.taskId],
          results: resultsByTaskId[ti.taskId],
          taskEduContents: taskEduContentByTaskId[ti.taskId],
          learningArea: learningAreaById[tasksById[ti.taskId].learningAreaId]
        }
      };
    });
  }
);

function asTaskInstance(item: TaskInstanceInterface): TaskInstance {
  if (item) {
    return Object.assign<TaskInstance, TaskInstanceInterface>(
      new TaskInstance(),
      item
    );
  }
}

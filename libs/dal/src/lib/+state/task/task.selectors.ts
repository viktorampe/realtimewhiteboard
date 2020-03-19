import { Dictionary } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  EduContent,
  FavoriteInterface,
  LearningAreaInterface,
  TaskEduContentInterface,
  TaskInterface
} from '../../+models';
import { Task } from '../../+models/Task';
import { FavoriteQueries } from '../favorite';
import { LearningAreaQueries } from '../learning-area';
import { getTaskClassGroupAssigneeByTask } from '../task-class-group/task-class-group.selectors';
import { TaskEduContentQueries } from '../task-edu-content';
import { getTaskGroupAssigneeByTask } from '../task-group/task-group.selectors';
import { getTaskStudentAssigneeByTask } from '../task-student/task-student.selectors';
import { AssigneeInterface } from './Assignee.interface';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './task.reducer';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from './TaskWithAssignees.interface';

export const selectTaskState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectTaskState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectTaskState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectTaskState, selectAll);

export const getCount = createSelector(selectTaskState, selectTotal);

export const getIds = createSelector(selectTaskState, selectIds);

export const getAllEntities = createSelector(selectTaskState, selectEntities);

/**
 * returns array of objects in the order of the given ids
 * @example
 * task$: TaskInterface[] = this.store.pipe(
    select(TaskQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectTaskState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => asTask(state.entities[id]));
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * task$: TaskInterface = this.store.pipe(
    select(TaskQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectTaskState,
  (state: State, props: { id: number }) => asTask(state.entities[props.id])
);

/**
 * returns an object with tasks grouped by learning area id as key
 * @example
 * tasksByLearningArea$ = this.store.pipe(select(TaskQueries.getByLearningAreaId))
 */
export const getByLearningAreaId = createSelector(
  selectTaskState,
  (state: State) => {
    const byKey: any = {};
    (state.ids as number[]).forEach((id: number) => {
      const item = asTask(state.entities[id]);
      if (!byKey[item.learningAreaId]) {
        byKey[item.learningAreaId] = [];
      }
      byKey[item.learningAreaId].push(item);
    });
    return byKey;
  }
);

export const getForLearningAreaId = createSelector(
  getByLearningAreaId,
  (state: State, props: { learningAreaId: number }) => {
    return state[props.learningAreaId] || [];
  }
);

export const getShared = createSelector(
  selectTaskState,
  (state: State, props: { userId: number }) => {
    const ids: number[] = <number[]>state.ids;
    return ids
      .filter(id => state.entities[id].personId !== props.userId) //personId is the teacherId
      .map(id => asTask(state.entities[id]));
  }
);

export const getOwn = createSelector(
  selectTaskState,
  (state: State, props: { userId: number }) => {
    const ids: number[] = <number[]>state.ids;
    return ids
      .filter(id => state.entities[id].personId === props.userId) //personId is the teacherId
      .map(id => asTask(state.entities[id]));
  }
);

export const getSharedLearningAreaIds = createSelector(
  selectTaskState,
  (state: State, props: { userId: number }) => {
    return new Set(
      Object.values(state.entities)
        .filter(task => task.personId !== props.userId)
        .map(task => task.learningAreaId)
    );
  }
);

export const getSharedTaskIdsByLearningAreaId = createSelector(
  selectTaskState,
  (state: State, props: { userId: number; learningAreaId: number }) => {
    const ids: number[] = <number[]>state.ids;
    return ids.filter(
      id =>
        state.entities[id].personId !== props.userId &&
        state.entities[id].learningAreaId === props.learningAreaId
    );
  }
);

function asTask(item: TaskInterface): Task {
  if (item) {
    return Object.assign<Task, TaskInterface>(new Task(), item);
  }
}

function addTaskDates(
  taskWithAssignees: TaskWithAssigneesInterface
): TaskWithAssigneesInterface {
  const now = new Date();
  const { assignees } = taskWithAssignees;
  let status = TaskStatusEnum.PENDING;

  const maxDate = dates =>
    dates.length ? new Date(Math.max(...dates)) : undefined;
  const minDate = dates =>
    dates.length ? new Date(Math.min(...dates)) : undefined;

  const startDate = minDate(assignees.filter(a => a.start).map(a => +a.start));
  const endDate = maxDate(assignees.filter(a => a.end).map(a => +a.end));

  if (startDate && endDate) {
    if (startDate > now) {
      status = TaskStatusEnum.PENDING;
    } else if (endDate > now) {
      status = TaskStatusEnum.ACTIVE;
    } else {
      status = TaskStatusEnum.FINISHED;
    }
  }

  return { ...taskWithAssignees, startDate, endDate, status };
}

function mapToTaskWithAssigneeInterface(
  task: TaskInterface,
  learningArea: LearningAreaInterface,
  taskEduContents: TaskEduContentInterface[],
  assigneesByTask: Dictionary<AssigneeInterface[]>,
  favoriteTaskIds: number[]
): TaskWithAssigneesInterface {
  return addTaskDates({
    ...task,
    learningArea: learningArea,
    eduContentAmount: taskEduContents ? taskEduContents.length : 0,
    taskEduContents: (taskEduContents || [])
      .sort((a, b) => a.index - b.index)
      .map(tEdu => ({
        ...tEdu,
        eduContent: EduContent.toEduContent(tEdu.eduContent)
      })),
    assignees: assigneesByTask[task.id] || [],
    isFavorite: favoriteTaskIds.includes(task.id)
  });
}

export const combinedAssigneesByTask = createSelector(
  [
    getTaskClassGroupAssigneeByTask,
    getTaskGroupAssigneeByTask,
    getTaskStudentAssigneeByTask
  ],
  (tCGA, tGA, tSA, props) => {
    const taskClassGroupAssigneesKeys = Object.keys(tCGA);
    const taskGroupAssigneesKeys = Object.keys(tGA);
    const taskStudentAssigneesKeys = Object.keys(tSA);

    const dict = [
      ...taskClassGroupAssigneesKeys,
      ...taskGroupAssigneesKeys,
      ...taskStudentAssigneesKeys
    ].reduce((acc, key) => {
      if (!acc[key]) {
        acc[key] = [].concat(tCGA[key] || [], tGA[key] || [], tSA[key] || []);
      }
      return acc;
    }, {});

    return dict;
  }
);

export const getAllTasksWithAssignments = createSelector(
  [
    getAll,
    LearningAreaQueries.getAllEntities,
    TaskEduContentQueries.getAllGroupedByTaskId,
    combinedAssigneesByTask,
    FavoriteQueries.getTaskFavorites
  ],
  (
    tasks: TaskInterface[],
    learningAreaDict: Dictionary<LearningAreaInterface>,
    taskEduContentByTask: Dictionary<TaskEduContentInterface[]>,
    assigneesByTask: Dictionary<AssigneeInterface[]>,
    favoriteTasks: FavoriteInterface[]
  ) => {
    const favoriteTaskIds = favoriteTasks.map(fav => fav.taskId);
    return tasks.map(task =>
      mapToTaskWithAssigneeInterface(
        task,
        learningAreaDict[task.learningAreaId],
        taskEduContentByTask[task.id],
        assigneesByTask,
        favoriteTaskIds
      )
    );
  }
);

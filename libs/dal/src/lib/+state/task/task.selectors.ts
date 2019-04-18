import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskInterface } from '../../+models';
import { Task } from '../../+models/Task';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './task.reducer';

export const selectTaskState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectTaskState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectTaskState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectTaskState,
  selectAll
);

export const getCount = createSelector(
  selectTaskState,
  selectTotal
);

export const getIds = createSelector(
  selectTaskState,
  selectIds
);

export const getAllEntities = createSelector(
  selectTaskState,
  selectEntities
);

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

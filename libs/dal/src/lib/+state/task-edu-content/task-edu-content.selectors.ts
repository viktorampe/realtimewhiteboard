import { groupArrayByKey } from '@campus/utils';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './task-edu-content.reducer';

export const selectTaskEduContentState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectTaskEduContentState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectTaskEduContentState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectTaskEduContentState, selectAll);

export const getCount = createSelector(selectTaskEduContentState, selectTotal);

export const getIds = createSelector(selectTaskEduContentState, selectIds);

export const getAllEntities = createSelector(
  selectTaskEduContentState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * taskEduContent$: TaskEduContentInterface[] = this.store.pipe(
    select(TaskEduContentQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectTaskEduContentState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * taskEduContent$: TaskEduContentInterface = this.store.pipe(
    select(TaskEduContentQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectTaskEduContentState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

/**
 * returns a set of task Ids for tasks where not all task-educontents is finished
 */
export const getUnfinishedTaskIds = createSelector(
  selectTaskEduContentState,
  (state: State) => {
    return new Set(
      Object.values(state.entities).reduce(
        (acc, curr) => (curr.submitted ? acc : [...acc, curr.taskId]),
        []
      )
    );
  }
);

export const getAllGroupedByTaskId = createSelector(
  selectTaskEduContentState,
  (state: State) => {
    return groupArrayByKey(Object.values(state.entities), 'taskId');
  }
);

export const getAllByTaskId = createSelector(
  selectTaskEduContentState,
  (state: State, props: { taskId: number }) => {
    return (<number[]>state.ids)
      .filter(id => state.entities[id].taskId === props.taskId)
      .map(t => state.entities[t]);
  }
);

export const getByEduContentId = createSelector(
  selectTaskEduContentState,
  (state: State, props: { eduContentId: number }) => {
    return (state.ids as number[]).reduce((acc, id) => {
      return state.entities[id].eduContentId === props.eduContentId
        ? [...acc, state.entities[id]]
        : acc;
    }, []);
  }
);

export const getByTaskAndEduContentId = createSelector(
  selectTaskEduContentState,
  (state: State, props: { taskId: number; eduContentId: number }) => {
    const taskEduContentId = (<number[]>state.ids).find(
      id =>
        state.entities[id].taskId === props.taskId &&
        state.entities[id].eduContentId === props.eduContentId
    );

    return state.entities[taskEduContentId];
  }
);

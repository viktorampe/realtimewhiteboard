import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectClassGroupState } from '../class-group/class-group.selectors';
import { AssigneeTypesEnum } from '../task/AssigneeTypes.enum';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './task-class-group.reducer';

export const selectTaskClassGroupState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectTaskClassGroupState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectTaskClassGroupState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectTaskClassGroupState, selectAll);

export const getCount = createSelector(selectTaskClassGroupState, selectTotal);

export const getIds = createSelector(selectTaskClassGroupState, selectIds);

export const getAllEntities = createSelector(
  selectTaskClassGroupState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * taskClassGroup$: TaskClassGroupInterface[] = this.store.pipe(
    select(TaskClassGroupQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectTaskClassGroupState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * taskClassGroup$: TaskClassGroupInterface = this.store.pipe(
    select(TaskClassGroupQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectTaskClassGroupState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

export const getTaskClassGroupAssigneeByTask = createSelector(
  [getAll, selectClassGroupState],
  (taskClassGroups, classGroupState) =>
    taskClassGroups.reduce((dict, tcg) => {
      if (!dict[tcg.taskId]) {
        dict[tcg.taskId] = [];
      }
      dict[tcg.taskId].push({
        id: tcg.id,
        type: AssigneeTypesEnum.CLASSGROUP,
        relationId: tcg.classGroupId,
        label: classGroupState.entities[tcg.classGroupId].name,
        start: tcg.start,
        end: tcg.end
      });

      return dict;
    }, {})
);

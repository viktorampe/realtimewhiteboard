import { groupArrayByKey } from '@campus/utils';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UnlockedFreePracticeInterface } from '../../+models';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './unlocked-free-practice.reducer';

export const selectUnlockedFreePracticeState = createFeatureSelector<State>(
  NAME
);

export const getError = createSelector(
  selectUnlockedFreePracticeState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectUnlockedFreePracticeState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectUnlockedFreePracticeState,
  selectAll
);

export const getCount = createSelector(
  selectUnlockedFreePracticeState,
  selectTotal
);

export const getIds = createSelector(
  selectUnlockedFreePracticeState,
  selectIds
);

export const getAllEntities = createSelector(
  selectUnlockedFreePracticeState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * unlockedFreePractice$: UnlockedFreePracticeInterface[] = this.store.pipe(
    select(UnlockedFreePracticeQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectUnlockedFreePracticeState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * unlockedFreePractice$: UnlockedFreePracticeInterface = this.store.pipe(
    select(UnlockedFreePracticeQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectUnlockedFreePracticeState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

export const findOne = createSelector(
  selectUnlockedFreePracticeState,
  (state: State, props: Partial<UnlockedFreePracticeInterface>) => {
    return Object.values(state.entities).find(unlockedFreePractice => {
      return Object.keys(props).every(
        prop => !props[prop] || unlockedFreePractice[prop] === props[prop]
      );
    });
  }
);

export const findMany = createSelector(
  selectUnlockedFreePracticeState,
  (state: State, props: Partial<UnlockedFreePracticeInterface>) => {
    return Object.values(state.entities).filter(unlockedFreePractice => {
      return Object.keys(props).every(
        prop => !props[prop] || unlockedFreePractice[prop] === props[prop]
      );
    });
  }
);

export const getGroupedByEduContentTOCId = createSelector(
  selectUnlockedFreePracticeState,
  (state: State) => {
    return groupArrayByKey(Object.values(state.entities), 'eduContentTOCId');
  }
);

export const getGroupedByEduContentBookId = createSelector(
  selectUnlockedFreePracticeState,
  (state: State) => {
    return groupArrayByKey(Object.values(state.entities), 'eduContentBookId');
  }
);

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UnlockedBoekeGroup, UnlockedBoekeGroupInterface } from '../../+models';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './unlocked-boeke-group.reducer';

export const selectUnlockedBoekeGroupState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectUnlockedBoekeGroupState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectUnlockedBoekeGroupState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectUnlockedBoekeGroupState, selectAll);

export const getCount = createSelector(
  selectUnlockedBoekeGroupState,
  selectTotal
);

export const getIds = createSelector(selectUnlockedBoekeGroupState, selectIds);

export const getAllEntities = createSelector(
  selectUnlockedBoekeGroupState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * unlockedBoekeGroup$: UnlockedBoekeGroupInterface[] = this.store.pipe(
    select(UnlockedBoekeGroupQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectUnlockedBoekeGroupState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * unlockedBoekeGroup$: UnlockedBoekeGroupInterface = this.store.pipe(
    select(UnlockedBoekeGroupQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectUnlockedBoekeGroupState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

export const getShared = createSelector(
  selectUnlockedBoekeGroupState,
  (state: State, props: { userId: number }) => {
    const ids: number[] = <number[]>state.ids;
    return ids
      .filter(
        id => !asUnlockedBoekeStudent(state.entities[id]).isOwn(props.userId)
      )
      .map(id => state.entities[id]);
  }
);

export const getOwn = createSelector(
  selectUnlockedBoekeGroupState,
  (state: State, props: { userId: number }) => {
    const ids: number[] = <number[]>state.ids;
    return ids
      .filter(id =>
        asUnlockedBoekeStudent(state.entities[id]).isOwn(props.userId)
      )
      .map(id => state.entities[id]);
  }
);

function asUnlockedBoekeStudent(
  item: UnlockedBoekeGroupInterface
): UnlockedBoekeGroup {
  if (item) {
    return Object.assign<UnlockedBoekeGroup, UnlockedBoekeGroupInterface>(
      new UnlockedBoekeGroup(),
      item
    );
  }
}

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UnlockedContentInterface } from '../../+models';
import { UnlockedContent } from '../../+models/UnlockedContent';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './unlocked-content.reducer';

export const selectUnlockedContentState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectUnlockedContentState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectUnlockedContentState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectUnlockedContentState,
  selectAll
);

export const getCount = createSelector(
  selectUnlockedContentState,
  selectTotal
);

export const getIds = createSelector(
  selectUnlockedContentState,
  selectIds
);

export const getAllEntities = createSelector(
  selectUnlockedContentState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * unlockedContent$: UnlockedContentInterface[] = this.store.pipe(
    select(UnlockedContentQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectUnlockedContentState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => asUnlockedContent(state.entities[id]));
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * unlockedContent$: UnlockedContentInterface = this.store.pipe(
    select(UnlockedContentQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectUnlockedContentState,
  (state: State, props: { id: number }) =>
    asUnlockedContent(state.entities[props.id])
);

export const getByBundleIds = createSelector(
  selectUnlockedContentState,
  (state: State) => {
    const byKey = {};
    const ids = <number[]>state.ids;
    ids.forEach(id => {
      const item = state.entities[id];
      if (!byKey[item.bundleId]) {
        byKey[item.bundleId] = [];
      }
      byKey[item.bundleId].push(asUnlockedContent(item));
    });
    return byKey;
  }
);

export const getByBundleId = createSelector(
  selectUnlockedContentState,
  (state: State, props: { bundleId: number }) => {
    const ids = <number[]>state.ids;

    return ids.reduce((acc, id, idx, arr) => {
      return state.entities[id].bundleId === +props.bundleId
        ? [...acc, state.entities[id]]
        : acc;
    }, []);
  }
);

function asUnlockedContent(item: UnlockedContentInterface): UnlockedContent {
  if (item) {
    return Object.assign<UnlockedContent, UnlockedContentInterface>(
      new UnlockedContent(),
      item
    );
  }
}

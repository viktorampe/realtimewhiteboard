import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './edu-contents.reducer';

export const selectEduContentState = createFeatureSelector<State>(
  'eduContents'
);

export const getError = createSelector(
  selectEduContentState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectEduContentState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectEduContentState, selectAll);

export const getCount = createSelector(selectEduContentState, selectTotal);

export const getIds = createSelector(selectEduContentState, selectIds);

export const getAllEntities = createSelector(
  selectEduContentState,
  selectEntities
);

export const getByIds = createSelector(
  selectEduContentState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

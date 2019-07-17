import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './edu-content-toc.reducer';

export const selectEduContentTocState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectEduContentTocState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectEduContentTocState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectEduContentTocState, selectAll);

export const getCount = createSelector(selectEduContentTocState, selectTotal);

export const getIds = createSelector(selectEduContentTocState, selectIds);

export const getAllEntities = createSelector(
  selectEduContentTocState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * eduContentToc$: EduContentTocInterface[] = this.store.pipe(
    select(EduContentTocQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectEduContentTocState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);


/**
 * returns array of objects in the order of the given ids
 * @example
 * eduContentToc$: EduContentTocInterface = this.store.pipe(
    select(EduContentTocQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectEduContentTocState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EduContentBookInterface } from '../../+models';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './edu-content-book.reducer';

export const selectEduContentBookState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectEduContentBookState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectEduContentBookState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectEduContentBookState,
  selectAll
);

export const getCount = createSelector(
  selectEduContentBookState,
  selectTotal
);

export const getIds = createSelector(
  selectEduContentBookState,
  selectIds
);

export const getAllEntities = createSelector(
  selectEduContentBookState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * eduContentBook$: EduContentBookInterface[] = this.store.pipe(
    select(EduContentBookQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectEduContentBookState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * eduContentBook$: EduContentBookInterface = this.store.pipe(
    select(EduContentBookQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectEduContentBookState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

export const getDiaboloEnabledBookIds = createSelector(
  selectEduContentBookState,
  (state: State) =>
    (state.ids as number[]).filter(id => state.entities[id].diabolo)
);

export const isBookDiaboloEnabled = createSelector(
  getDiaboloEnabledBookIds,
  (diaboloIds: number[], props: { id: number }) => diaboloIds.includes(props.id)
);

export const getDiaboloEnabledBooks = createSelector(
  getAll,
  (books: EduContentBookInterface[]) => books.filter(book => book.diabolo)
);

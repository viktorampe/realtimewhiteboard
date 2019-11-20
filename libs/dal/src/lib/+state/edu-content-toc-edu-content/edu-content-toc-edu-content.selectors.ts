import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NAME, selectIds, State } from './edu-content-toc-edu-content.reducer';

export const selectEduContentTocEduContentState = createFeatureSelector<State>(
  NAME
);

export const getError = createSelector(
  selectEduContentTocEduContentState,
  (state: State) => state.error
);

export const getIds = createSelector(
  selectEduContentTocEduContentState,
  selectIds
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * eduContentTocEduContent$: EduContentTocEduContentInterface[] = this.store.pipe(
    select(EduContentTocEduContentQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectEduContentTocEduContentState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * eduContentTocEduContent$: EduContentTocEduContentInterface = this.store.pipe(
    select(EduContentTocEduContentQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectEduContentTocEduContentState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

export const isBookLoaded = createSelector(
  selectEduContentTocEduContentState,
  (state: State, props: { bookId: number }) =>
    state.loadedBooks.some(loadedBookId => loadedBookId === props.bookId)
);

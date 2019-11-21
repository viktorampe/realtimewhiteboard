import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  EduContentTOCEduContentInterface,
  EDU_CONTENT_TYPE
} from '../../+models';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './edu-content-toc-edu-content.reducer';

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
export const getAll = createSelector(
  selectEduContentTocEduContentState,
  selectAll
);

export const getAllEntities = createSelector(
  selectEduContentTocEduContentState,
  selectEntities
);

export const getCount = createSelector(
  selectEduContentTocEduContentState,
  selectTotal
);

export const getAllByType = createSelector(
  getAll,
  (
    entities: EduContentTOCEduContentInterface[],
    props: { type: EDU_CONTENT_TYPE }
  ) => entities.filter(entity => entity.type === props.type)
);

export const getAllByTypeAndToc = createSelector(
  getAllByType,
  (
    entities: EduContentTOCEduContentInterface[],
    props: { type: EDU_CONTENT_TYPE; tocId: number }
  ) => entities.filter(entity => entity.eduContentTOCId === props.tocId)
);

export const getCountByTypeAndToc = createSelector(
  getAllByTypeAndToc,
  (
    entities: EduContentTOCEduContentInterface[],
    props: { type: EDU_CONTENT_TYPE; tocId: number }
  ) => entities.length
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
  (state: State, props: { ids: string[] }) => {
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
  (state: State, props: { id: string }) => state.entities[props.id]
);

export const isBookLoaded = createSelector(
  selectEduContentTocEduContentState,
  (state: State, props: { bookId: number }) =>
    state.loadedBooks.some(loadedBookId => loadedBookId === props.bookId)
);

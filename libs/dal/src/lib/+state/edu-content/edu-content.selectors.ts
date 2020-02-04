import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EduContent, EduContentInterface } from '../../+models';
import {
  NAME,
  selectAll,
  selectIds,
  selectTotal,
  State
} from './edu-content.reducer';

export const selectEduContentState = createFeatureSelector<State>(NAME);

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
  (state: State) => {
    return (<number[]>state.ids).reduce((acc, id) => {
      acc[id] = asEduContent(state.entities[id]);
      return acc;
    }, {});
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * eduContent$: EduContentInterface[] = this.store.pipe(
    select(EduContentQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectEduContentState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => asEduContent(state.entities[id]));
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * eduContent$: EduContentInterface = this.store.pipe(
    select(EduContentQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectEduContentState,
  (state: State, props: { id: number }) =>
    asEduContent(state.entities[props.id])
);

export const getBoekeByBookId = createSelector(
  getAll,
  (eduContents: EduContentInterface[], props: { bookId: number }) => {
    return asEduContent(
      eduContents.find(
        eduContent =>
          eduContent.publishedEduContentMetadata &&
          eduContent.publishedEduContentMetadata.eduContentBookId ===
            props.bookId &&
          eduContent.type === 'boek-e'
      )
    );
  }
);

function asEduContent(item: EduContentInterface): EduContent {
  if (item) {
    return Object.assign<EduContent, EduContentInterface>(
      new EduContent(),
      item
    );
  }
}

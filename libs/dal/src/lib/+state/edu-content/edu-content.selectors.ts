import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EduContent, EduContentInterface } from '../../+models';
import {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './edu-content.reducer';

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
    return props.ids.map(id => state.entities[id]);
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
  (state: State, props: { id: number }) => state.entities[props.id]
);

export const getAllAsContents = createSelector(getAll, entities =>
  entities.map(item =>
    Object.assign<EduContent, EduContentInterface>(new EduContent(), item)
  )
);

export const getByIdAsContents = createSelector(
  selectEduContentState,
  (state: State, props: { id: number }) =>
    Object.assign<EduContent, EduContentInterface>(
      new EduContent(),
      state.entities[props.id]
    )
);

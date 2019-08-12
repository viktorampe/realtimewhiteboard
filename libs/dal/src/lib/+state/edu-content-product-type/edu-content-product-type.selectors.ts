import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EduContentProductTypeInterface } from '../../+models';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './edu-content-product-type.reducer';

export const selectEduContentProductTypeState = createFeatureSelector<State>(
  NAME
);

export const getError = createSelector(
  selectEduContentProductTypeState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectEduContentProductTypeState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectEduContentProductTypeState,
  selectAll
);

export const getCount = createSelector(
  selectEduContentProductTypeState,
  selectTotal
);

export const getIds = createSelector(
  selectEduContentProductTypeState,
  selectIds
);

export const getAllEntities = createSelector(
  selectEduContentProductTypeState,
  selectEntities
);

export const getAllOrderedBy = createSelector(
  getAll,
  (
    eduContentProductTypes: EduContentProductTypeInterface[],
    props: { orderBy: 'name' | 'sequence' }
  ) => {
    switch (props.orderBy) {
      case 'sequence':
        return eduContentProductTypes.sort((a, b) =>
          a.sequence > b.sequence ? 1 : -1
        );
      case 'name':
      default:
        return eduContentProductTypes.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
    }
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * eduContentProductType$: EduContentProductTypeInterface[] = this.store.pipe(
    select(EduContentProductTypeQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectEduContentProductTypeState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * eduContentProductType$: EduContentProductTypeInterface = this.store.pipe(
    select(EduContentProductTypeQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectEduContentProductTypeState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClassGroupInterface } from '../../+models';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './class-group.reducer';

export const selectClassGroupState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectClassGroupState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectClassGroupState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectClassGroupState,
  selectAll
);

export const getCount = createSelector(
  selectClassGroupState,
  selectTotal
);

export const getIds = createSelector(
  selectClassGroupState,
  selectIds
);

export const getAllEntities = createSelector(
  selectClassGroupState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * classGroup$: ClassGroupInterface[] = this.store.pipe(
    select(ClassGroupQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectClassGroupState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * classGroup$: ClassGroupInterface = this.store.pipe(
    select(ClassGroupQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectClassGroupState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * classGroup$: ClassGroupInterface = this.store.pipe(
  select(ClassGroupQueries.getById, { id: 3 })
);
*/
export const getByMethodId = createSelector(
  getAll,
  (classGroups: ClassGroupInterface[], props: { id: number }) => {
    return classGroups.filter(
      classGroup =>
        classGroup.licenses &&
        classGroup.licenses.some(
          license =>
            license.product &&
            license.product.productContents &&
            license.product.productContents.some(
              productContent =>
                productContent.licenseType === 'method' &&
                productContent.methodId === props.id
            )
        )
    );
  }
);

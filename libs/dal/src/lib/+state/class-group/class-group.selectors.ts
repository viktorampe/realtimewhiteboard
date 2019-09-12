import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClassGroupInterface, EduContentBookInterface } from '../../+models';
import { EduContentBookQueries } from '../edu-content-book';
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

export const getClassGroupsByMethodId = createSelector(
  getAll,
  (
    classGroups: ClassGroupInterface[]
  ): { [id: number]: ClassGroupInterface[] } => {
    return classGroups.reduce(
      (
        acc: { [id: number]: ClassGroupInterface[] },
        currentClassGroup: ClassGroupInterface
      ) => {
        const methodIds: number[] = []
          .concat(
            ...currentClassGroup.licenses.map(license =>
              license.product.productContents
                .filter(
                  productContent => productContent.licenseType === 'method'
                )
                .map(productContent => productContent.methodId)
            )
          )
          .filter(methodId => methodId);

        methodIds.forEach(methodId => {
          if (!acc[methodId]) {
            acc[methodId] = [];
          }

          acc[methodId].push(currentClassGroup);
        });

        return acc;
      },
      {}
    );
  }
);

export const getClassGroupsForBook = createSelector(
  EduContentBookQueries.getById,
  getClassGroupsByMethodId,
  (
    book: EduContentBookInterface,
    classGroupsByMethodId: { [id: number]: ClassGroupInterface[] },
    props: { id: number }
  ): ClassGroupInterface[] => {
    const bookYearIds = book.years.map(year => year.id);

    if (!classGroupsByMethodId[book.methodId]) {
      return [];
    }

    return classGroupsByMethodId[book.methodId].filter(classGroup => {
      //One of the classGroups' years must be in the books' years
      return classGroup.years.some(year => bookYearIds.indexOf(year.id) !== -1);
    });
  }
);

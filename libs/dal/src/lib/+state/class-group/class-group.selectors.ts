import { Dictionary } from '@ngrx/entity';
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

export const getClassGroupsByMethodId = createSelector(
  getAll,
  (classGroups: ClassGroupInterface[]): Dictionary<ClassGroupInterface[]> => {
    return classGroups.reduce(
      (acc, currentClassGroup) => {
        currentClassGroup.licenses.forEach(license => {
          license.product.productContents.forEach(productContent => {
            if (
              productContent.licenseType === 'method' &&
              productContent.methodId
            ) {
              if (!acc[productContent.methodId]) {
                acc[productContent.methodId] = [];
              }

              acc[productContent.methodId].push(currentClassGroup);
            }
          });
        });

        return acc;
      },
      {} as Dictionary<ClassGroupInterface[]>
    );
  }
);

export const getClassGroupsForBook = createSelector(
  EduContentBookQueries.getById,
  getClassGroupsByMethodId,
  (
    book: EduContentBookInterface,
    classGroupsByMethodId: Dictionary<ClassGroupInterface[]>,
    props: {
      id: number;
      filterByYear: boolean;
    }
  ): ClassGroupInterface[] => {
    const bookYearIds = book.years.map(year => year.id);

    if (!classGroupsByMethodId[book.methodId]) {
      return [];
    }

    console.log(props.filterByYear);

    return classGroupsByMethodId[book.methodId].filter(classGroup => {
      //One of the classGroups' years must be in the books' years
      return (
        !props.filterByYear ||
        classGroup.years.some(year => bookYearIds.includes(year.id))
      );
    });
  }
);

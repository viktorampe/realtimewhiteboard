import { Dictionary } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EduContentTOCInterface } from '../../+models';
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

export const getAll = createSelector(
  selectEduContentTocState,
  selectAll
);

export const getCount = createSelector(
  selectEduContentTocState,
  selectTotal
);

export const getIds = createSelector(
  selectEduContentTocState,
  selectIds
);

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

export const isBookLoaded = createSelector(
  selectEduContentTocState,
  (state: State, props: { bookId: number }) =>
    state.loadedBooks.some(loadedBookId => loadedBookId === props.bookId)
);

export const getTocsByBook = createSelector(
  selectEduContentTocState,
  (state: State) =>
    (state.ids as number[]).reduce((acc, currentTocId) => {
      const currentToc = state.entities[currentTocId];
      if (!acc[currentToc.treeId]) {
        acc[currentToc.treeId] = [];
      }
      acc[currentToc.treeId].push(currentToc);
      return acc;
    }, {})
);

export const getTocsForBook = createSelector(
  getTocsByBook,
  (
    tocsByBook: Dictionary<EduContentTOCInterface[]>,
    props: { bookId: number }
  ) => tocsByBook[props.bookId] || []
);

export const getChaptersForBook = createSelector(
  selectEduContentTocState,
  (state: State, props: { bookId: number }) =>
    (state.ids as number[]).reduce((acc, currentTocId) => {
      const currentToc = state.entities[currentTocId];
      if (currentToc.treeId === props.bookId && currentToc.depth === 0) {
        acc.push(currentToc);
      }
      return acc;
    }, [])
);

// returns the direct descendant tocs for a given toc, by tocId
export const getTocsForToc = createSelector(
  selectEduContentTocState,
  (state: State, props: { tocId: number }) => {
    const parentToc = state.entities[props.tocId];

    return (state.ids as number[]).reduce((acc, currentTocId) => {
      const currentToc = state.entities[currentTocId];

      if (
        currentToc.treeId === parentToc.treeId && // same book
        (currentToc.lft > parentToc.lft && currentToc.rgt < parentToc.rgt) && //is a child of parentToc
        currentToc.depth === parentToc.depth + 1 // correct depth
      ) {
        acc.push(currentToc);
      }
      return acc;
    }, []);
  }
);

export const getTocsForBookAndLearningPlanGoal = createSelector(
  getTocsByBook,
  (
    tocsByBook: Dictionary<EduContentTOCInterface[]>,
    props: { bookId: number; learningPlanGoalId: number }
  ) => {
    const tocs = tocsByBook[props.bookId] || [];
    return tocs.filter(toc =>
      toc.learningPlanGoalIds.includes(props.learningPlanGoalId)
    );
  }
);

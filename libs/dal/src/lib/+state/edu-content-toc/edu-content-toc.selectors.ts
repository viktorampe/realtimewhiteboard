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

export const getTreeForBook = createSelector(
  getTocsByBook,
  (
    tocsByBook: Dictionary<EduContentTOCInterface[]>,
    props: { bookId: number }
  ) => {
    // The tocs must be ordered by their lfts in order for makeTree to work
    const tocs = tocsByBook[props.bookId].sort(
      (aToc, bToc) => aToc.lft - bToc.lft
    );

    return makeTree(tocs);
  }
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

export const getLessonDisplaysForBook = createSelector(
  getTocsForBookAndLearningPlanGoal,
  // getChaptersForBook relies on the fact that there will only be 2 levels
  // use getTocsForBook to search in all levels
  getChaptersForBook,
  (
    tocsForBookLearningPlanGoal: EduContentTOCInterface[],
    tocsForBook: EduContentTOCInterface[]
  ) => {
    const array = tocsForBookLearningPlanGoal.map(currentToc => {
      const display = {
        eduContentTocId: currentToc.id,
        values: [currentToc.title]
      };

      let parent = findParentTOC(currentToc, tocsForBook);
      while (parent) {
        display.values = [parent.title, ...display.values];
        parent = findParentTOC(parent, tocsForBook);
      }

      return display;
    });

    return array;
  }
);

function findParentTOC(currentToc, tocsToSearch) {
  return tocsToSearch.find(
    parentToc =>
      parentToc.depth === currentToc.depth - 1 &&
      currentToc.lft > parentToc.lft &&
      currentToc.rgt < parentToc.rgt
  );
}

// copied from the API, see edu-content-toc.js makeTree
// convert a 'nested set' result to an object tree structure
function makeTree(data: EduContentTOCInterface[]) {
  const branch: EduContentTOCInterface[] = [];

  // check if there are leaves (children) in the tree we passed
  while (data.length) {
    // get the first element to process and remove it from the tree
    const currentTOC: EduContentTOCInterface = { ...data.shift() };

    // find the number of leaves in our branch (including sub-branches)
    // when there are no more sub-branches this will be 0
    const leaves: number = (currentTOC.rgt - currentTOC.lft - 1) / 2;

    // since we ordered by 'lft', the next x (= leaves) rows contain all child nodes
    // we get those nodes and remove them from the tree
    const children: EduContentTOCInterface[] = data.splice(0, leaves);

    // build the subtree with our child rows and append it to the current element
    currentTOC.children = makeTree(children);

    // append the current element (with sub-branches) to the current branch
    branch.push(currentTOC);
  }

  // return the (sub)tree
  return branch;
}

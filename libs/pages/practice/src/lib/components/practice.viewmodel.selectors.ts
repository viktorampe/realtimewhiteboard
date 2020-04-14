import {
  EduContentBookInterface,
  EduContentBookQueries,
  EduContentTOCEduContentInterface,
  EduContentTocEduContentQueries,
  EduContentTOCInterface,
  EduContentTocQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  MethodInterface,
  MethodQueries,
  ResultInterface,
  ResultQueries,
  UnlockedFreePracticeInterface,
  UnlockedFreePracticeQueries
} from '@campus/dal';
import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

export const getChaptersWithStatuses = createSelector(
  [
    (state, props) => EduContentTocQueries.getTreeForBook(state, props),
    // TODO: this can be more efficient, can't use the count selectors or getAllByType
    // because it doesn't match with the props:
    EduContentTocEduContentQueries.getAll,
    (state, props) => ResultQueries.getBestResultByEduContentId(state, props),
    UnlockedFreePracticeQueries.getGroupedByEduContentBookId
  ],
  (
    treeForBook: EduContentTOCInterface[],
    eduContentTocEduContents: EduContentTOCEduContentInterface[],
    bestResultByEduContentId: { [id: number]: ResultInterface },
    unlockedFreePractices: Dictionary<UnlockedFreePracticeInterface[]>,
    props: { bookId: number; taskId?: number }
  ) => {
    if (
      !unlockedFreePractices[props.bookId] ||
      unlockedFreePractices[props.bookId].length === 0
    ) {
      return [];
    }
    const chaptersUnlockedForBook = unlockedFreePractices[props.bookId].reduce(
      (acc, ufp) => {
        if (ufp.eduContentTOCId) {
          acc.push(ufp.eduContentTOCId);
        }
        return acc;
      },
      []
    );
    let bookTree = treeForBook;
    if (chaptersUnlockedForBook.length) {
      bookTree = bookTree.filter(chapter =>
        chaptersUnlockedForBook.includes(chapter.id)
      );
    }
    return bookTree.map(chapter => {
      const tocId = chapter.id;
      const title = chapter.title;
      let availableExercises = 0;
      let completedExercises = 0;
      let earnedKwetons = 0;

      const childrenTocIds = chapter.children.map(child => child.id);

      const uniqueExerciseIds = Array.from(
        new Set(
          eduContentTocEduContents.reduce((acc, tocEduContent) => {
            if (
              tocEduContent.type === 'exercise' &&
              (tocEduContent.eduContentTOCId === chapter.id ||
                childrenTocIds.includes(tocEduContent.eduContentTOCId))
            ) {
              acc.push(tocEduContent.eduContentId);
            }
            return acc;
          }, [])
        )
      );

      availableExercises = uniqueExerciseIds.length;

      uniqueExerciseIds.forEach(exId => {
        if (bestResultByEduContentId[exId]) {
          const result = bestResultByEduContentId[exId];

          completedExercises++;
          earnedKwetons += result.stars * 10;
        }
      });

      const kwetonsRemaining = availableExercises * 30 - earnedKwetons;

      return {
        tocId,
        title,
        exercises: {
          available: availableExercises,
          completed: completedExercises
        },
        kwetonsRemaining
      } as ChapterWithStatusInterface;
    });
  }
);

export interface UnlockedBookInterface {
  bookId: number;
  logoUrl: string;
  name: string;
  learningAreaName: string;
}

export interface ChapterWithStatusInterface {
  tocId: number;
  title: string;
  exercises: {
    available: number;
    completed: number;
  };
  kwetonsRemaining: number;
}

export const getUnlockedBooks = createSelector(
  [
    EduContentBookQueries.getAllEntities,
    LearningAreaQueries.getAllEntities,
    MethodQueries.getAllEntities,
    UnlockedFreePracticeQueries.getAll
  ],
  (
    bookDict: Dictionary<EduContentBookInterface>,
    learningAreaDict: Dictionary<LearningAreaInterface>,
    methodDict: Dictionary<MethodInterface>,
    uFPs: UnlockedFreePracticeInterface[]
  ) => {
    const booksInUFP = Array.from(
      new Set(uFPs.map(uFP => uFP.eduContentBookId))
    );

    const books = booksInUFP.map(id => bookDict[id]);

    return books.map(book => {
      const bookMethod = methodDict[book.methodId];

      const logoUrl =
        bookMethod.code && 'assets/methods/' + bookMethod.code + '.jpg';

      const learningAreaName = learningAreaDict[bookMethod.learningAreaId].name;

      const name = `${book.title} ${book.years
        .map(year => year.label)
        .join(', ')}`;

      return {
        bookId: book.id,
        logoUrl,
        learningAreaName,
        name
      } as UnlockedBookInterface;
    });
  }
);

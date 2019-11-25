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
  Result,
  ResultInterface,
  ResultQueries
} from '@campus/dal';
import { createSelector } from '@ngrx/store';

export interface ChapterWithStatus {
  tocId: number;
  title: string;
  exercises: {
    available: number;
    completed: number;
  };
  kwetonsRemaining: number;
}

export const getChaptersWithStatuses = createSelector(
  [
    EduContentTocQueries.getTreeForBook,
    // TODO: this can be more efficient, can't use the count selectors or getAllByType
    // because it doesn't match with the props:
    EduContentTocEduContentQueries.getAll,
    ResultQueries.getBestResultByEduContentId
  ],
  (
    treeForBook: EduContentTOCInterface[],
    eduContentTocEduContent: EduContentTOCEduContentInterface[],
    bestResultByEduContentId: { [id: number]: ResultInterface },
    props: { bookId: number }
  ) => {
    return treeForBook.map(chapter => {
      const tocId = chapter.id;
      const title = chapter.title;

      const childrenTocIds = chapter.children.map(child => child.id);
      const relatedTOCEduContent = eduContentTocEduContent.filter(
        tocEduContent => {
          return childrenTocIds.includes(tocEduContent.eduContentTOCId);
        }
      );
      const relatedResults = relatedTOCEduContent.reduce(
        (acc, relatedContent) => {
          if (bestResultByEduContentId[relatedContent.eduContentId]) {
            acc.push(bestResultByEduContentId[relatedContent.eduContentId]);
          }

          return acc;
        },
        []
      );

      const availableExercises = relatedTOCEduContent.length;
      const completedExercises = relatedResults.length;

      const earnedKwetons = relatedResults.reduce((acc, relatedResult) => {
        const result = relatedResult as Result;

        return acc + result.stars * 10;
      }, 0);

      const kwetonsRemaining = availableExercises * 30 - earnedKwetons;

      return {
        tocId,
        title,
        exercises: {
          available: availableExercises,
          completed: completedExercises
        },
        kwetonsRemaining
      } as ChapterWithStatus;
    });
  }
);

export interface UnlockedBookInterface {
  bookId: number;
  logoUrl: string;
  name: string;
  learningAreaName: string;
}

export const getUnlockedBooks = createSelector(
  [
    EduContentBookQueries.getAll,
    LearningAreaQueries.getAllEntities,
    MethodQueries.getAllEntities
  ],
  (
    books: EduContentBookInterface[],
    learningAreas: { [id: number]: LearningAreaInterface },
    methods: { [id: number]: MethodInterface }
  ) => {
    return books.map(book => {
      const bookMethod = methods[book.methodId];

      const logoUrl =
        bookMethod.code && 'assets/methods/' + bookMethod.code + '.jpg';

      const learningAreaName = learningAreas[bookMethod.learningAreaId].name;

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

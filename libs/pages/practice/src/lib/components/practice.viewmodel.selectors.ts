import {
  EduContentBookInterface,
  EduContentBookQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  MethodInterface,
  MethodQueries
} from '@campus/dal';
import { createSelector } from '@ngrx/store';

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

      const name = `${book.title} - ${book.years
        .map(year => year.label)
        .join(',')}`;

      return {
        bookId: book.id,
        logoUrl,
        learningAreaName,
        name
      } as UnlockedBookInterface;
    });
  }
);

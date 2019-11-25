import { EduContentTOCInterface, EduContentTocQueries } from '@campus/dal';
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
  [EduContentTocQueries.getTreeForBook],
  (tocsForBook: EduContentTOCInterface[], props: { bookId: number }) => {
    return tocsForBook;
  }
);

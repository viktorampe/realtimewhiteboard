import {
  EduContent,
  EduContentBookInterface,
  EduContentBookQueries,
  EduContentQueries,
  FavoriteInterface,
  FavoriteQueries,
  FavoriteTypesEnum,
  MethodInterface,
  MethodQueries
} from '@campus/dal';
import { createSelector } from '@ngrx/store';

export interface FavoriteMethodWithEduContent {
  favorite: FavoriteInterface;
  bookId: number;
  eduContent: EduContent;
  logoUrl: string;
}

export const getFavoritesWithEduContent = createSelector(
  [
    FavoriteQueries.getByType(FavoriteTypesEnum.BOEKE),
    EduContentQueries.getAllEntities,
    MethodQueries.getAllEntities,
    EduContentBookQueries.getAllEntities
  ],
  (
    favorites: FavoriteInterface[],
    eduContents: { [id: number]: EduContent },
    methods: { [id: number]: MethodInterface },
    books: { [id: number]: EduContentBookInterface },
    props: { type: FavoriteTypesEnum }
  ) => {
    return favorites.map(favorite => {
      const eduContent = eduContents[favorite.eduContentId];
      const bookId =
        eduContent && eduContent.publishedEduContentMetadata.eduContentBookId;
      const book = bookId && books[bookId];
      const logoUrl =
        book &&
        methods[book.methodId].code &&
        'assets/methods/' + methods[book.methodId].code + '.jpg';

      return {
        favorite,
        //Shortcut property for navigating to the 'method'
        bookId,
        eduContent,
        logoUrl
      } as FavoriteMethodWithEduContent;
    });
  }
);

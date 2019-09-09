import {
  EduContent,
  EduContentInterface,
  EduContentQueries,
  FavoriteInterface,
  FavoriteQueries,
  FavoriteTypesEnum
} from '@campus/dal';
import { createSelector } from '@ngrx/store';

export interface FavoriteWithEduContent {
  favorite: FavoriteInterface;
  bookId: number;
  eduContent: EduContentInterface;
}

export const getFavoritesWithEduContent = createSelector(
  FavoriteQueries.getByType,
  EduContentQueries.getAllEntities,
  (
    favoritesByType: FavoriteInterface[],
    eduContents: { [id: number]: EduContent },
    props: { type: FavoriteTypesEnum }
  ) => {
    return favoritesByType.map(favorite => {
      const eduContent = eduContents[favorite.eduContentId];

      return {
        favorite,
        //Shortcut property for navigating to the 'method'
        bookId:
          eduContent && eduContent.publishedEduContentMetadata.eduContentBookId,
        eduContent: eduContent
      } as FavoriteWithEduContent;
    });
  }
);

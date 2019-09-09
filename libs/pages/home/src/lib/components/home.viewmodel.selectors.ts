import {
  EduContentInterface,
  EduContentQueries,
  FavoriteInterface,
  FavoriteQueries,
  FavoriteTypesEnum
} from '@campus/dal';
import { createSelector } from '@ngrx/store';

export interface FavoriteWithEduContent {
  favorite: FavoriteInterface;
  eduContent: EduContentInterface;
}

export const getFavoritesWithEduContent = createSelector(
  FavoriteQueries.getByType,
  EduContentQueries.getAllEntities,
  (
    favoritesByType: FavoriteInterface[],
    eduContents: { [id: number]: EduContentInterface },
    props: { type: FavoriteTypesEnum }
  ) => {
    return favoritesByType.map(favorite => {
      return {
        favorite,
        eduContent: eduContents[favorite.eduContentId]
      } as FavoriteWithEduContent;
    });
  }
);

import { TestBed } from '@angular/core/testing';
import {
  EduContentFixture,
  FavoriteFixture,
  FavoriteTypesEnum
} from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import { getFavoritesWithEduContent } from './home.viewmodel.selectors';

describe('PracticeViewModel', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({});
  });

  describe('getFavoritesWithEduContent', () => {
    const projector: Function = getFavoritesWithEduContent.projector;
    const favoritesByType = [
      new FavoriteFixture({
        id: 1,
        type: FavoriteTypesEnum.BOEKE,
        eduContentId: 1
      }),
      new FavoriteFixture({
        id: 2,
        type: FavoriteTypesEnum.BOEKE,
        eduContentId: 2
      }),
      new FavoriteFixture({
        id: 3,
        type: FavoriteTypesEnum.BOEKE,
        eduContentId: 3
      })
    ];
    const eduContents = {
      1: new EduContentFixture({ id: 1 }, { eduContentBookId: 3 }),
      2: new EduContentFixture({ id: 2 }, { eduContentBookId: 4 })
    };

    it('should return favorites with EduContent', () => {
      const result = projector(favoritesByType, eduContents, {});

      expect(result).toEqual([
        {
          favorite: favoritesByType[0],
          bookId: eduContents[1].publishedEduContentMetadata.eduContentBookId,
          eduContent: eduContents[1]
        },
        {
          favorite: favoritesByType[1],
          bookId: eduContents[2].publishedEduContentMetadata.eduContentBookId,
          eduContent: eduContents[2]
        },
        {
          favorite: favoritesByType[2],
          bookId: undefined,
          eduContent: undefined
        }
      ]);
    });
  });
});

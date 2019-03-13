import { FavoriteInterface } from '../+models';
import { FavoriteTypeEnum } from '../favorite/favorite.service.interface';

export class FavoriteFixture implements FavoriteInterface {
  // defaults
  type = FavoriteTypeEnum.AREA;
  created = new Date();
  name = 'foo';
  personId = 1;
  learningAreaId = 1;

  constructor(props: Partial<FavoriteInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

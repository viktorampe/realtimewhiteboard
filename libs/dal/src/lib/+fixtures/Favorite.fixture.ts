import { FavoriteInterface, FavoriteTypesEnum } from '../+models';

export class FavoriteFixture implements FavoriteInterface {
  // defaults
  type = FavoriteTypesEnum.AREA;
  created = new Date();
  name = 'foo';
  personId = 1;
  learningAreaId = 1;
  eduContentId = 1;
  bundleId = 1;
  taskId = 1;

  constructor(props: Partial<FavoriteInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

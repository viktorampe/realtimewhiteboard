import { FavoriteInterface, FavoriteTypesEnum } from '../+models';

export class FavoriteFixture implements FavoriteInterface {
  // defaults
  id: 1;
  type = FavoriteTypesEnum.AREA;
  created = new Date();
  name = 'foo';
  personId = 1;
  learningAreaId = 1;

  constructor(props: Partial<FavoriteInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

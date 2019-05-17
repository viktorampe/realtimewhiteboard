import { FavoriteInterface, FavoriteTypesEnum } from '../+models';
import { LearningAreaFixture } from './LearningArea.fixture';

export class FavoriteFixture implements FavoriteInterface {
  // defaults
  id = 1;
  type = FavoriteTypesEnum.AREA;
  created = new Date();
  name = 'foo';
  personId = 1;
  learningAreaId = 1;
  learningArea = new LearningAreaFixture();

  constructor(props: Partial<FavoriteInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

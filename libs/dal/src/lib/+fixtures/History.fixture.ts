import { FavoriteTypesEnum, HistoryInterface } from '../+models';
import { LearningAreaFixture } from './LearningArea.fixture';

export class HistoryFixture implements HistoryInterface {
  // defaults
  id = 1;
  type = FavoriteTypesEnum.AREA; // TODO: need to change to quicklink type enum?
  created = new Date();
  name = 'foo';
  personId = 1;
  learningAreaId = 1;
  learningArea = new LearningAreaFixture();

  constructor(props: Partial<HistoryInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

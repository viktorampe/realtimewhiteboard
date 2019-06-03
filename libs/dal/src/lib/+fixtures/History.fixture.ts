import { HistoryInterface, HistoryTypesEnum } from '../+models';
import { LearningAreaFixture } from './LearningArea.fixture';

export class HistoryFixture implements HistoryInterface {
  // defaults
  id = 1;
  type = HistoryTypesEnum.AREA;
  created = new Date();
  name = 'foo';
  personId = 1;
  learningAreaId = 1;
  learningArea = new LearningAreaFixture();
  criteria?: string;
  eduContentId?: number;
  bundleId?: number;
  taskId?: number;

  constructor(props: Partial<HistoryInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

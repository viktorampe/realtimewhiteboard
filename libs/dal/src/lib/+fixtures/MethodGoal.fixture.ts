import { MethodGoalInterface } from '../+models';

export class MethodGoalFixture implements MethodGoalInterface {
  // defaults
  name: string;
  domain: string;
  Sortnumber?: number;
  id?: number;
  methodId?: number;
  eduContentBookId?: number;
  finalTerms = [];
  learningPlanGoals = [];
  eduContentTOC = [];
  eduContentMetadata = [];

  constructor(props: Partial<MethodGoalInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

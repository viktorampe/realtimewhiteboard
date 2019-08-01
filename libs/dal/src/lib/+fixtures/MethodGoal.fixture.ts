import { MethodGoalInterface } from '../+models';

export class MethodGoalFixture implements MethodGoalInterface {
  // defaults
  name = 'De leerlingen kunnen goed lezen';
  domain = 'Lezen';
  Sortnumber = 1;
  id = 1;
  methodId = 1;
  eduContentBookId = 1;
  finalTerms = [];
  learningPlanGoals = [];
  eduContentTOC = [];
  eduContentMetadata = [];

  constructor(props: Partial<MethodGoalInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

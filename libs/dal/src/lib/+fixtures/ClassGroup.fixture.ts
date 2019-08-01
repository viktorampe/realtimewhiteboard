import { ClassGroupInterface } from '../+models';

export class ClassGroupFixture implements ClassGroupInterface {
  // defaults
  name = '1A';
  id = 1;
  schoolId = 1;
  classGroupTypeId = 1;
  licenses = [];
  years = [];
  learningPlanGoalProgress = [];
  schoolRoleMapping = [];

  constructor(props: Partial<ClassGroupInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

import { PersonFixture, ResultStatus } from '@campus/dal';
import { StudentTaskContentFixture } from './StudentTaskContent.fixture';
import { StudentTaskWithContentInterface } from './StudentTaskWithContent.interface';

export class StudentTaskWithContentFixture
  implements StudentTaskWithContentInterface {
  name = 'FooTask';
  description = 'Maak deze taak als voorbereiding op deze taak.';
  learningAreaName = 'Wiskunde';
  start = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  end = new Date(Date.now() + 7 * 24 * 3600 * 1000);
  assigner = new PersonFixture({ firstName: 'Jan', name: 'Smit' });
  contents = [
    new StudentTaskContentFixture({
      status: ResultStatus.STATUS_COMPLETED
    }),
    new StudentTaskContentFixture({
      status: ResultStatus.STATUS_OPENED
    }),
    new StudentTaskContentFixture()
  ];
  isFinished = false;
  requiredContentCount = 3;
  requiredContentFinished = 1;

  constructor(props: Partial<StudentTaskWithContentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

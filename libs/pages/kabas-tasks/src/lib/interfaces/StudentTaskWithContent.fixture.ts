import { PersonFixture } from '@campus/dal';
import { StudentTaskContentFixture } from './StudentTaskContent.fixture';
import { StudentTaskWithContentInterface } from './StudentTaskWithContent.interface';

export class StudentTaskWithContentFixture
  implements StudentTaskWithContentInterface {
  name = 'FooTask';
  description = 'Maak deze taak als voorbereiding op deze taak.';
  learningAreaName = 'Wiskunde';
  startDate = new Date('1 january 2018');
  endDate = new Date('20 january 2018');
  assigner = new PersonFixture({ firstName: 'Jan', name: 'Smit' });
  contents = [
    new StudentTaskContentFixture(),
    new StudentTaskContentFixture(),
    new StudentTaskContentFixture()
  ];

  constructor(props: Partial<StudentTaskWithContentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

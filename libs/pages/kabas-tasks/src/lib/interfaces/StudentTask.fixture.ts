import { StudentTaskInterface } from './StudentTask.interface';

export class StudentTaskFixture implements StudentTaskInterface {
  // defaults
  name = 'foo';
  description = 'bar';
  learningAreaName = 'fooLearningarea';
  learningAreaId = 1;
  count = {
    finishedRequired: 2,
    totalRequired: 1
  };
  isFinished = false;
  isUrgent = true;
  dateGroupLabel = 'fooDateGroupLabel';
  dateLabel = 'fooDateLabel';
  endDate = new Date();
  actions = [];

  constructor(props: Partial<StudentTaskInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

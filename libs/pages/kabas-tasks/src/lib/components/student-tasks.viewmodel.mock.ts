import { BehaviorSubject } from 'rxjs';
import { StudentTaskFixture } from '../interfaces/StudentTask.fixture';
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';

export class MockStudentTasksViewModel {
  public studentTasks$: BehaviorSubject<StudentTaskInterface[]>;
  public activeTasks$: BehaviorSubject<StudentTaskInterface[]>;
  public finishedTasks$: BehaviorSubject<StudentTaskInterface[]>;
  public studentTasks = [
    new StudentTaskFixture({
      isFinished: true,
      endDate: new Date(2019, 8, 31)
    }),
    new StudentTaskFixture(),
    new StudentTaskFixture()
  ];

  constructor() {
    this.studentTasks$ = new BehaviorSubject<StudentTaskInterface[]>(
      this.studentTasks
    );
  }

  public setupStreams() {}
}

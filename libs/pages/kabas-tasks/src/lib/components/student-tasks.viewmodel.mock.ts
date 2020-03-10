import { BehaviorSubject } from 'rxjs';
import { StudentTaskFixture } from '../interfaces/StudentTask.fixture';
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';

export class MockStudentTasksViewModel {
  public studentTasks$: BehaviorSubject<StudentTaskInterface[]>;
  public activeTasks$: BehaviorSubject<StudentTaskInterface[]>;
  public finishedTasks$: BehaviorSubject<StudentTaskInterface[]>;
  public studentTasks = [
    new StudentTaskFixture({
      isFinished: false
    }),
    new StudentTaskFixture({
      isFinished: false
    }),
    new StudentTaskFixture()
  ];

  constructor() {
    this.studentTasks$ = new BehaviorSubject<StudentTaskInterface[]>(
      this.studentTasks
    );
  }

  public setupStreams() {}
}

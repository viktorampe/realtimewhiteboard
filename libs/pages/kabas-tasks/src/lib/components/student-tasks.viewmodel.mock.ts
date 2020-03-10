import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import { StudentTaskFixture } from '../interfaces/StudentTask.fixture';
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';
import { StudentTasksViewModel } from './student-tasks.viewmodel';

export class MockStudentTasksViewModel
  implements ViewModelInterface<StudentTasksViewModel> {
  public studentTasks$: BehaviorSubject<StudentTaskInterface[]>;

  private studentTasks = [
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

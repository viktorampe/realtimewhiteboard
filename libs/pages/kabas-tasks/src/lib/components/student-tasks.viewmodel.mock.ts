import { Params } from '@angular/router';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import { StudentTaskFixture } from '../interfaces/StudentTask.fixture';
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';
import { StudentTaskWithContentFixture } from '../interfaces/StudentTaskWithContent.fixture';
import { StudentTaskWithContentInterface } from '../interfaces/StudentTaskWithContent.interface';
import { StudentTasksViewModel } from './student-tasks.viewmodel';

export class MockStudentTasksViewModel
  implements ViewModelInterface<StudentTasksViewModel> {
  public studentTasks$: BehaviorSubject<StudentTaskInterface[]>;
  public currentTask$ = new BehaviorSubject<StudentTaskWithContentInterface>(
    new StudentTaskWithContentFixture()
  );
  public routeParams$: BehaviorSubject<Params>;

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
    this.routeParams$ = new BehaviorSubject<Params>({});
  }

  public openEduContentAsExercise() {}
  public openEduContentAsSolution() {}
  public openEduContentFromResult() {}
  public openEduContentAsStream() {}
  public openEduContentAsDownload() {}
  public openBoeke() {}
  public previewEduContentAsImage() {}
}

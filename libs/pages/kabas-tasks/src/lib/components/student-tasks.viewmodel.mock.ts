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

  private nextWeek: Date = new Date(Date.now() + 7 * 24 * 3600 * 1000);
  private studentTasks = [
    new StudentTaskFixture({
      isFinished: true,
      endDate: this.nextWeek
    }),
    new StudentTaskFixture({
      endDate: this.nextWeek
    }),
    new StudentTaskFixture({
      endDate: this.nextWeek
    })
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

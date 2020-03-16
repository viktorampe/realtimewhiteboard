import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { EduContent, ResultInterface, TaskInterface } from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { StudentTaskFixture } from '../interfaces/StudentTask.fixture';
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';
import { StudentTaskWithContentFixture } from '../interfaces/StudentTaskWithContent.fixture';
import { StudentTaskWithContentInterface } from '../interfaces/StudentTaskWithContent.interface';
import { StudentTasksViewModel } from './student-tasks.viewmodel';
@Injectable({ providedIn: 'root' })
export class MockStudentTasksViewModel
  implements ViewModelInterface<StudentTasksViewModel> {
  public studentTasks$: BehaviorSubject<StudentTaskInterface[]>;
  public currentTask$ = new BehaviorSubject<StudentTaskWithContentInterface>(
    new StudentTaskWithContentFixture()
  );

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
  public routeParams$: Observable<Params>;
  openTask(task: TaskInterface): void {}
  openEduContentAsExercise(eduContent: EduContent): void {}
  openEduContentAsSolution(eduContent: EduContent): void {}
  openEduContentFromResult(result: ResultInterface): void {}
  openEduContentAsStream(eduContent: EduContent): void {}
  openEduContentAsDownload(eduContent: EduContent): void {}
  openBoeke(eduContent: EduContent): void {}
  previewEduContentAsImage(eduContent: EduContent): void {}

  public setupStreams() {}
}

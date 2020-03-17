import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import {
  EduContent,
  PersonFixture,
  ResultInterface,
  TaskInterface
} from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
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
    new StudentTaskWithContentFixture({
      assigner: new PersonFixture({
        name: 'Smit',
        firstName: 'Fooke',
        displayName: 'Fooke Smit'
      })
    })
  );
  public routeParams$ = new BehaviorSubject<Params>(null);

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
  }

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

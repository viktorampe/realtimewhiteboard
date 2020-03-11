import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import { StudentTaskFixture } from '../interfaces/StudentTask.fixture';
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';
import { StudentTaskWithContentInterface } from '../interfaces/StudentTaskWithContent.interface';
import { StudentTasksViewModel } from './student-tasks.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockStudentTasksViewModel
  implements ViewModelInterface<StudentTasksViewModel> {
  public studentTasks$: BehaviorSubject<StudentTaskInterface[]>;
  public currentTask$: BehaviorSubject<StudentTaskWithContentInterface>;
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
    this.studentTasks$ = new BehaviorSubject<StudentTaskInterface[]>([]);
  }

  openEduContentAsExercise() {}
  openEduContentAsSolution() {}
  openEduContentFromResult() {}
  openEduContentAsStream() {}
  openEduContentAsDownload() {}
  openBoeke() {}
  previewEduContentAsImage() {}
}

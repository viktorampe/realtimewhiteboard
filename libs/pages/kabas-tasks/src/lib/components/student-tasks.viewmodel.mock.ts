import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { EduContent, PersonFixture, ResultInterface } from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import { StudentTaskFixture } from '../interfaces/StudentTask.fixture';
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';
import { StudentTaskWithContentFixture } from '../interfaces/StudentTaskWithContent.fixture';
import { StudentTaskWithContentInterface } from '../interfaces/StudentTaskWithContent.interface';
import { StudentTasksViewModel } from './student-tasks.viewmodel';

@Injectable({
  providedIn: 'root'
})
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

  private studentTasks = [
    new StudentTaskFixture({
      learningAreaId: 1,
      learningAreaName: 'aardrijkskunde',
      isFinished: true,
      endDate: new Date(2019, 8, 31)
    }),
    new StudentTaskFixture({
      learningAreaId: 1,
      learningAreaName: 'aardrijkskunde',
      isUrgent: true
    }),
    new StudentTaskFixture({
      learningAreaId: 1,
      learningAreaName: 'aardrijkskunde'
    }),
    new StudentTaskFixture({
      learningAreaId: 1,
      learningAreaName: 'aardrijkskunde'
    }),
    new StudentTaskFixture({
      learningAreaId: 1,
      learningAreaName: 'aardrijkskunde'
    }),
    new StudentTaskFixture({
      learningAreaId: 1,
      learningAreaName: 'aardrijkskunde'
    }),
    new StudentTaskFixture({
      learningAreaId: 1,
      learningAreaName: 'aardrijkskunde',
      isUrgent: true
    }),
    new StudentTaskFixture({
      learningAreaId: 2,
      learningAreaName: 'wiskunde'
    }),
    new StudentTaskFixture({
      learningAreaId: 2,
      learningAreaName: 'wiskunde'
    }),
    new StudentTaskFixture({
      learningAreaId: 2,
      learningAreaName: 'wiskunde',
      isUrgent: true
    })
  ];

  constructor() {
    this.studentTasks$ = new BehaviorSubject<StudentTaskInterface[]>(
      this.studentTasks
    );
  }

  openEduContentAsExercise(eduContent: EduContent): void {}
  openEduContentAsSolution(eduContent: EduContent): void {}
  openEduContentFromResult(result: ResultInterface): void {}
  openEduContentAsStream(eduContent: EduContent): void {}
  openEduContentAsDownload(eduContent: EduContent): void {}
  openBoeke(eduContent: EduContent): void {}
  previewEduContentAsImage(eduContent: EduContent): void {}

  public setupStreams() {}
}

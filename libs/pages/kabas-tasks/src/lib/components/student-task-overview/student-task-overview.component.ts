import { Component, HostBinding, OnInit } from '@angular/core';
import { SectionModeEnum } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { StudentTaskWithContentInterface } from '../../interfaces/StudentTaskWithContent.interface';

interface TaskByLearningAreaInfoInterface {
  learningAreaName: string;
  taskCount: number;
  urgentCount: number;
}

@Component({
  selector: 'campus-student-task-overview',
  templateUrl: './student-task-overview.component.html',
  styleUrls: ['./student-task-overview.component.scss']
})
export class StudentTaskOverviewComponent implements OnInit {
  @HostBinding('class.student-task-overview')
  studentTaskOverviewClass = true;

  tasks$: Observable<StudentTaskWithContentInterface[]>;
  tasksByLearningAreaInfo$: Observable<TaskByLearningAreaInfoInterface[]>;
  showFinishedTasks$ = new BehaviorSubject<boolean>(false);
  isGroupedByDate$ = new BehaviorSubject<boolean>(false);

  public sectionModes: typeof SectionModeEnum = SectionModeEnum;

  constructor() {}

  ngOnInit() {}

  emptyStateClick() {}

  public setShowFinishedTasks(value: boolean) {
    this.showFinishedTasks$.next(value);
  }
}

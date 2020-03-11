import { Component, HostBinding, OnInit } from '@angular/core';
import { SectionModeEnum } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { StudentTaskInterface } from '../../interfaces/StudentTask.interface';
import { MockStudentTasksViewModel } from '../student-tasks.viewmodel.mock';

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

  tasks$: Observable<StudentTaskInterface[]>; // this is the presentation stream

  sectionTitle$: Observable<string>;
  inEmptyState$: Observable<boolean>;
  emptyStateData$: Observable<{
    svgIcon: string;
    title?: string;
    description: string;
    ctaLabel?: string;
  }>;

  tasksByLearningAreaInfo$: Observable<TaskByLearningAreaInfoInterface[]>;
  showFinishedTasks$ = new BehaviorSubject<boolean>(false);
  isGroupedByDate$ = new BehaviorSubject<boolean>(false);

  public sectionModes: typeof SectionModeEnum = SectionModeEnum;

  // TODO: use the real viewmodel
  constructor(private viewmodel: MockStudentTasksViewModel) {}

  ngOnInit() {
    this.setPresentationStreams();
  }

  setPresentationStreams(): void {
    this.tasks$ = this.viewmodel.studentTasks$;

    this.inEmptyState$ = this.tasks$.pipe(map(tasks => tasks.length === 0));

    this.sectionTitle$ = combineLatest([
      this.tasks$,
      this.showFinishedTasks$
    ]).pipe(
      map(([tasks, showFinishedTasks]) => {
        return tasks.length === 0
          ? showFinishedTasks
            ? 'Je hebt geen afgewerkte taken'
            : 'Er staan geen taken voor je klaar'
          : showFinishedTasks
          ? 'Deze taken heb je gemaakt'
          : `${tasks.length} ${
              tasks.length === 1 ? 'taak staat' : 'taken staan'
            } voor je klaar`;
      })
    );

    this.emptyStateData$ = this.inEmptyState$.pipe(
      filter(inEmptyState => !!inEmptyState),
      switchMap(inEmptyState => this.showFinishedTasks$),
      map(showFinishedTasks => {
        return showFinishedTasks
          ? {
              title: 'Hier is niets te zien',
              description: 'Je hebt nog geen taken afgewerkt.',
              svgIcon: 'empty-state-all-done' // TODO: use correct icon
            }
          : {
              title: 'Je bent helemaal mee',
              description:
                'Er staan geen taken voor je klaar. Je kan altijd vrij oefenen.',
              ctaLabel: 'naar vrij oefenen',
              svgIcon: 'empty-state-all-done' // TODO: use correct icon
            };
      })
    );
  }

  emptyStateClick() {}

  public setShowFinishedTasks(value: boolean) {
    this.showFinishedTasks$.next(value);
  }
}

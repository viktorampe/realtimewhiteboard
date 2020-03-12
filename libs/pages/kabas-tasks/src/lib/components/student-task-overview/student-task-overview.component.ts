import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SectionModeEnum } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { StudentTaskInterface } from '../../interfaces/StudentTask.interface';
import { StudentTasksViewModel } from '../student-tasks.viewmodel';

export interface TaskByLearningAreaInfoInterface {
  learningAreaId: number;
  learningAreaName: string;
  taskCount: number;
  urgentCount: number;
}

interface TaskListSectionInterface {
  label: string;
  learningAreaId: number;
  items: StudentTaskInterface[];
}

@Component({
  selector: 'campus-student-task-overview',
  templateUrl: './student-task-overview.component.html',
  styleUrls: ['./student-task-overview.component.scss']
})
export class StudentTaskOverviewComponent implements OnInit {
  @HostBinding('class.student-task-overview')
  studentTaskOverviewClass = true;

  // main section
  private groupedByLearningArea$: Observable<TaskListSectionInterface[]>; // TODO: implement (see #3352)
  private groupedByDate$: Observable<TaskListSectionInterface[]>; // TODO: implement (see #3352)

  public sectionTitle$: Observable<string>;
  public taskCount$: Observable<number>;
  public emptyStateData$: Observable<{
    svgIcon: string;
    title?: string;
    description: string;
    ctaLabel?: string;
    ctaLink?: string;
  }>;

  public taskListSections$: Observable<TaskListSectionInterface[]>;

  // side section
  public showFinishedTasks$ = new BehaviorSubject<boolean>(false);
  public isGroupedByDate$ = new BehaviorSubject<boolean>(false);
  public tasksByLearningAreaInfo$: Observable<
    TaskByLearningAreaInfoInterface[]
  >;
  public sectionModes: typeof SectionModeEnum = SectionModeEnum;

  constructor(
    private viewmodel: StudentTasksViewModel,
    private router: Router
  ) {}

  ngOnInit() {
    this.setPresentationStreams();
  }

  private setPresentationStreams(): void {
    this.taskCount$ = this.viewmodel.studentTasks$.pipe(
      map(tasks => tasks.length)
    );

    this.sectionTitle$ = combineLatest([
      this.taskCount$,
      this.showFinishedTasks$
    ]).pipe(
      map(([taskCount, showFinishedTasks]) => {
        let title = '';

        if (taskCount === 0) {
          if (showFinishedTasks) {
            title = 'Je hebt geen afgewerkte taken';
          } else {
            title = 'Er staan geen taken voor je klaar';
          }
        } else {
          if (showFinishedTasks) {
            title = 'Deze taken heb je gemaakt';
          } else {
            title = `${taskCount} ${
              taskCount === 1 ? 'taak staat' : 'taken staan'
            } voor je klaar`;
          }
        }
        return title;
      })
    );

    this.emptyStateData$ = this.taskCount$.pipe(
      filter(taskCount => taskCount === 0),
      switchMap(inEmptyState => this.showFinishedTasks$),
      map(showFinishedTasks => {
        return showFinishedTasks
          ? {
              title: 'Hier is niets te zien',
              description: 'Je hebt nog geen afgewerkte taken.',
              svgIcon: 'empty-state-all-done' // TODO: use correct icon
            }
          : {
              title: 'Je bent helemaal mee',
              description:
                'Er staan geen taken voor je klaar. Je kan altijd vrij oefenen.',
              ctaLabel: 'Naar vrij oefenen',
              ctaLink: 'practice',
              svgIcon: 'empty-state-all-done' // TODO: use correct icon
            };
      })
    );

    this.taskListSections$ = this.isGroupedByDate$.pipe(
      switchMap(isGroupedByDate => {
        return isGroupedByDate
          ? this.groupedByDate$
          : this.groupedByLearningArea$;
      })
    );
  }

  scrollTo(target: number) {
    document.getElementById('' + target).scrollIntoView({
      block: 'start',
      inline: 'nearest',
      behavior: 'smooth'
    });
  }

  emptyStateClick(url: string) {
    this.router.navigate([url]);
  }
}

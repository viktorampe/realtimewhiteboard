import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SectionModeEnum } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { StudentTaskInterface } from '../../interfaces/StudentTask.interface';
import { StudentTasksViewModel } from './../student-tasks.viewmodel';

interface TaskByLearningAreaInfoInterface {
  learningAreaId: number;
  learningAreaName: string;
  taskCount: number;
  urgentCount: number;
}

interface TaskListSectionInterface {
  label: string;
  learningAreaId?: number;
  items: StudentTaskInterface[];
}

enum SortOrder {
  ASC = 1,
  DESC = -1
}

@Component({
  selector: 'campus-student-task-overview',
  templateUrl: './student-task-overview.component.html',
  styleUrls: ['./student-task-overview.component.scss']
})
export class StudentTaskOverviewComponent implements OnInit {
  public taskCount$: Observable<number>;
  public tasksByLearningAreaInfo$: Observable<
    TaskByLearningAreaInfoInterface[]
  >;
  public taskListSections$: Observable<TaskListSectionInterface[]>;
  public showFinishedTasks$ = new BehaviorSubject<boolean>(false);
  public isGroupedByDate$ = new BehaviorSubject<boolean>(false);

  public sectionModes: typeof SectionModeEnum = SectionModeEnum;

  @HostBinding('class.student-task-overview')
  studentTaskOverviewClass = true;

  constructor(
    private router: Router,
    private viewmodel: StudentTasksViewModel
  ) {
    this.setupStreams();
  }

  ngOnInit() {}

  public emptyStateClick() {
    this.router.navigate(['practice']);
  }
  public setShowFinishedTasks(value: boolean) {
    this.showFinishedTasks$.next(value);
  }

  private setupStreams() {
    // intermediate streams
    const finishedTasks$ = this.viewmodel.studentTasks$.pipe(
      map(studentTasks => studentTasks.filter(sT => sT.isFinished)),
      shareReplay(1)
    );

    const activeTasks$ = this.viewmodel.studentTasks$.pipe(
      map(studentTasks => studentTasks.filter(sT => !sT.isFinished)),
      shareReplay(1)
    );

    const activeTasksGroupedByLearningArea$ = activeTasks$.pipe(
      map(tasks =>
        this.toTaskListSections(tasks, 'learningAreaName')
          .map(section => this.sortItemsByEndDate(section, SortOrder.ASC))
          .sort((a, b) => this.sortByLabel(a, b, 'learningArea', SortOrder.ASC))
      ),
      shareReplay(1)
    );

    const finishedTasksGroupedByLearningArea$ = finishedTasks$.pipe(
      map(tasks =>
        this.toTaskListSections(tasks, 'learningAreaName')
          .map(section => this.sortItemsByEndDate(section, SortOrder.DESC))
          .sort((a, b) => this.sortByLabel(a, b, 'learningArea', SortOrder.ASC))
      ),
      shareReplay(1)
    );

    const activeTasksGroupedByDate$ = activeTasks$.pipe(
      map(tasks =>
        this.toTaskListSections(tasks, 'dateGroupLabel')
          .map(section => this.sortItemsByEndDate(section, SortOrder.ASC))
          .sort((a, b) => this.sortByLabel(a, b, 'date', SortOrder.ASC))
      ),
      shareReplay(1)
    );

    const finishedTasksGroupedByDate$ = finishedTasks$.pipe(
      map(tasks =>
        this.toTaskListSections(tasks, 'dateGroupLabel')
          .map(section => this.sortItemsByEndDate(section, SortOrder.DESC))
          .sort((a, b) => this.sortByLabel(a, b, 'date', SortOrder.DESC))
      ),
      shareReplay(1)
    );

    // presentation streams
    this.taskCount$ = this.showFinishedTasks$.pipe(
      switchMap(showFinished => (showFinished ? finishedTasks$ : activeTasks$)),
      map(tasks => tasks.length)
    );

    this.tasksByLearningAreaInfo$ = this.showFinishedTasks$.pipe(
      switchMap(showFinished =>
        showFinished
          ? finishedTasksGroupedByLearningArea$
          : activeTasksGroupedByLearningArea$
      ),
      map(sections =>
        sections.map(section => ({
          learningAreaId: section.learningAreaId,
          learningAreaName: section.label,
          taskCount: section.items.length,
          urgentCount: section.items.filter(task => task.isUrgent).length
        }))
      )
    );

    this.taskListSections$ = combineLatest([
      this.showFinishedTasks$,
      this.isGroupedByDate$
    ]).pipe(
      switchMap(([showFinished, groupByDate]) => {
        if (showFinished) {
          if (groupByDate) {
            return finishedTasksGroupedByDate$;
          } else {
            return finishedTasksGroupedByLearningArea$;
          }
        } else {
          if (groupByDate) {
            return activeTasksGroupedByDate$;
          } else {
            return activeTasksGroupedByLearningArea$;
          }
        }
      })
    );
  }

  private toTaskListSections(
    tasks: StudentTaskInterface[],
    key: keyof Pick<StudentTaskInterface, 'learningAreaName' | 'dateGroupLabel'>
  ): TaskListSectionInterface[] {
    return Object.values(
      tasks.reduce((acc, task) => {
        if (!acc[task[key]]) {
          acc[task[key]] = {
            label: task[key],
            learningAreaId:
              key === 'learningAreaName' ? task.learningAreaId : undefined,
            items: []
          };
        }

        acc[task[key]].items.push(task);

        return acc;
      }, {})
    );
  }

  private sortByLabel(
    a: TaskListSectionInterface,
    b: TaskListSectionInterface,
    labelType: 'learningArea' | 'date',
    order: SortOrder
  ) {
    if (labelType === 'learningArea') {
      return this.sortByString(a.label, b.label, order);
    }

    if (labelType === 'date') {
      return this.sortByDate(a.items[0].endDate, b.items[0].endDate, order);
    }

    return 0;
  }

  private sortItemsByEndDate(
    section: TaskListSectionInterface,
    order: SortOrder
  ): TaskListSectionInterface {
    return Object.assign(section, {
      items: section.items.sort(
        (a, b) =>
          this.sortByDate(a.endDate, b.endDate, order) ||
          this.sortByString(
            a.learningAreaName,
            b.learningAreaName,
            SortOrder.ASC
          ) ||
          this.sortByString(a.name, b.name, SortOrder.ASC)
      )
    });
  }

  private sortByDate(a: Date, b: Date, order: SortOrder) {
    return (+a - +b) * order;
  }

  private sortByString(a: string, b: string, order: SortOrder) {
    return a.localeCompare(b) * order;
  }
}

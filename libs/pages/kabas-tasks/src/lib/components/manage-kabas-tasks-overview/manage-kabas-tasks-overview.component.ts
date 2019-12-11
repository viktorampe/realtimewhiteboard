import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { combineLatest, map } from 'rxjs/operators';
import { TaskWithAssigneesInterface } from '../../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';

@Component({
  selector: 'campus-manage-kabas-tasks-overview',
  templateUrl: './manage-kabas-tasks-overview.component.html',
  styleUrls: ['./manage-kabas-tasks-overview.component.scss'],

  providers: [
    { provide: KabasTasksViewModel, useClass: MockKabasTasksViewModel }
  ]
})
export class ManageKabasTasksOverviewComponent implements OnInit {
  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public currentTab$: Observable<number>;
  private currentSortMode$ = new BehaviorSubject(TaskSortEnum.NAME);

  constructor(
    private viewModel: KabasTasksViewModel,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentTab$ = this.getCurrentTab();
    this.tasksWithAssignments$ = this.viewModel.tasksWithAssignments$.pipe(
      combineLatest(this.currentSortMode$),
      map(([tasks, sortMode]) => this.sortTasks(tasks, sortMode))
    );
    this.paperTasksWithAssignments$ = this.viewModel.paperTasksWithAssignments$.pipe(
      combineLatest(this.currentSortMode$),
      map(([tasks, sortMode]) => this.sortTasks(tasks, sortMode))
    );
  }

  clickAddDigitalTask() {
    console.log('TODO: adding digital task');
  }
  clickAddPaperTask() {
    console.log('TODO: adding paper task');
  }

  public onSelectedTabIndexChanged(tab: number) {
    this.router.navigate([], {
      queryParams: { tab }
    });
  }

  private getCurrentTab(): Observable<number> {
    return this.route.queryParams.pipe(map(queryParam => queryParam.tab));
  }

  // TODO: implement handler
  clickDeleteTasks() {}

  // TODO: implement handler
  clickArchiveTasks() {}

  // TODO: implement handler
  clickNewTask() {}

  public setSortMode(sortMode: TaskSortEnum) {
    this.currentSortMode$.next(sortMode);
  }

  public sortTasks(
    tasks: TaskWithAssigneesInterface[],
    sortMode: TaskSortEnum
  ) {
    switch (sortMode) {
      case TaskSortEnum.NAME:
        return this.sortByName(tasks);
      case TaskSortEnum.LEARNINGAREA:
        return this.sortByLearningArea(tasks);
      case TaskSortEnum.STARTDATE:
        return this.sortByStartDate(tasks);
    }
    // no sortMode -> no sorting
    return tasks;
  }

  private sortByName(tasks: TaskWithAssigneesInterface[]) {
    return tasks.sort((a, b) => {
      const taskA = a.name.toLowerCase();
      const taskB = b.name.toLowerCase();

      return taskA < taskB ? -1 : taskA > taskB ? 1 : 0;
    });
  }

  private sortByLearningArea(tasks: TaskWithAssigneesInterface[]) {
    return tasks.sort((a, b) => {
      const taskA = a.learningArea.name.toLowerCase();
      const taskB = b.learningArea.name.toLowerCase();

      return taskA < taskB ? -1 : taskA > taskB ? 1 : 0;
    });
  }

  private sortByStartDate(tasks: TaskWithAssigneesInterface[]) {
    return tasks.sort((a, b) => {
      const taskA = a.taskDates.startDate;
      const taskB = b.taskDates.startDate;

      return taskA < taskB ? -1 : taskA > taskB ? 1 : 0;
    });
  }
}

enum TaskSortEnum {
  'NAME' = 'NAME',
  'LEARNINGAREA' = 'LEARNINGAREA',
  'STARTDATE' = 'STARTDATE'
}

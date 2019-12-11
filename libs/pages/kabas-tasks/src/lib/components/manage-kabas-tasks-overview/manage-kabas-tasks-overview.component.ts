import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material';
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
  public TaskSortEnum = TaskSortEnum;
  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public currentTab$: Observable<number>;
  private currentSortMode$ = new BehaviorSubject(TaskSortEnum.NAME);

  @ViewChild('digitalSorting') private digitalSorting: MatSelect;
  @ViewChild('paperSorting') private paperSorting: MatSelect;

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

    this.resetSorting();
  }

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

  private getCurrentTab(): Observable<number> {
    return this.route.queryParams.pipe(map(queryParam => queryParam.tab));
  }

  private resetSorting() {
    this.setSortMode(TaskSortEnum.NAME);
    this.digitalSorting.value = undefined;
    this.paperSorting.value = undefined;
  }

  // TODO: implement handler
  clickDeleteTasks() {}

  // TODO: implement handler
  clickArchiveTasks() {}

  // TODO: implement handler
  clickNewTask() {}

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
      const taskA = a.startDate;
      const taskB = b.startDate;

      // undefined dates at the front of the list
      if (!taskA) return -1;
      if (!taskB) return 1;

      return taskA < taskB ? -1 : taskA > taskB ? 1 : 0;
    });
  }
}

enum TaskSortEnum {
  'NAME' = 'NAME',
  'LEARNINGAREA' = 'LEARNINGAREA',
  'STARTDATE' = 'STARTDATE'
}

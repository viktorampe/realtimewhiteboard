import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningAreaInterface } from '@campus/dal';
import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from '@campus/search';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssigneeTypesEnum } from '../../interfaces/Assignee.interface';
import { TaskWithAssigneesInterface } from '../../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';

export enum TaskSortEnum {
  'NAME' = 'NAME',
  'LEARNINGAREA' = 'LEARNINGAREA',
  'STARTDATE' = 'STARTDATE'
}

@Component({
  selector: 'campus-manage-kabas-tasks-overview',
  templateUrl: './manage-kabas-tasks-overview.component.html',
  styleUrls: ['./manage-kabas-tasks-overview.component.scss']
})
export class ManageKabasTasksOverviewComponent implements OnInit {
  public TaskSortEnum = TaskSortEnum;
  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public currentTab$: Observable<number>;
  public learningAreaFilter$: Observable<SearchFilterCriteriaInterface>;
  public learningAreaFilterPaper$: Observable<SearchFilterCriteriaInterface>;
  public assigneeFilter$: Observable<SearchFilterCriteriaInterface>;
  public assigneeFilterPaper$: Observable<SearchFilterCriteriaInterface>;
  public taskStatusFilter: SearchFilterCriteriaInterface;

  private currentSortMode$ = new BehaviorSubject(TaskSortEnum.NAME);

  @ViewChild('digitalSorting') private digitalSorting: MatSelect;
  @ViewChild('paperSorting') private paperSorting: MatSelect;

  public actions = [
    { label: 'bekijken', handler: () => console.log('bekijken') },
    { label: 'archiveren', handler: () => console.log('archiveren') },
    { label: 'resultaten', handler: () => console.log('resultaten') },
    { label: 'doelenmatrix', handler: () => console.log('doelenmatrix') }
  ];

  constructor(
    private viewModel: KabasTasksViewModel,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentTab$ = this.getCurrentTab();

    this.tasksWithAssignments$ = combineLatest([
      this.viewModel.tasksWithAssignments$,
      this.currentSortMode$
    ]).pipe(map(([tasks, sortMode]) => this.sortTasks(tasks, sortMode)));

    this.paperTasksWithAssignments$ = combineLatest([
      this.viewModel.paperTasksWithAssignments$,
      this.currentSortMode$
    ]).pipe(map(([tasks, sortMode]) => this.sortTasks(tasks, sortMode)));

    this.learningAreaFilter$ = this.tasksWithAssignments$.pipe(
      map(this.sortAndCreateForLearningAreaFilter)
    );
    this.assigneeFilter$ = this.tasksWithAssignments$.pipe(
      map(this.sortAndCreateForAssigneeFilter)
    );
    this.learningAreaFilterPaper$ = this.paperTasksWithAssignments$.pipe(
      map(this.sortAndCreateForLearningAreaFilter)
    );

    this.assigneeFilterPaper$ = this.paperTasksWithAssignments$.pipe(
      map(this.sortAndCreateForAssigneeFilter)
    );

    this.taskStatusFilter = {
      name: 'taskStatus',
      label: 'taak status',
      keyProperty: 'status',
      displayProperty: 'icon',
      values: [
        {
          data: {
            status: 'pending',
            icon: 'task:pending'
          },
          visible: true
        },
        {
          data: {
            status: 'active',
            icon: 'task:active'
          },
          visible: true
        },
        {
          data: {
            status: 'finished',
            icon: 'task:finished'
          },
          visible: true
        }
      ]
    };
  }
  public sortAndCreateForAssigneeFilter(tasksWithAssignments) {
    const assigns = [];
    tasksWithAssignments.forEach(twa => {
      twa.assignees.forEach(ass => {
        assigns.push({
          type: ass.type,
          id: ass.id,
          label: ass.label
        });
      });
    });
    const identifiers = [];
    const values = assigns.reduce((acc, assignee) => {
      const identifier = `${assignee.type}-${assignee.id}`;
      if (identifiers.includes(identifier)) {
        return acc;
      }
      identifiers.push(identifier);
      return [
        ...acc,
        {
          data: {
            label: assignee.label,
            identifier: { type: assignee.type, id: assignee.id }
          },
          visible: true
        } as SearchFilterCriteriaValuesInterface
      ];
    }, []);
    values.sort(function(a, b) {
      const order = {
        [AssigneeTypesEnum.CLASSGROUP]: 1,
        [AssigneeTypesEnum.GROUP]: 2,
        [AssigneeTypesEnum.STUDENT]: 3
      };
      return (
        order[a.data.identifier.type] - order[b.data.identifier.type] ||
        (a.data.label > b.data.label ? 1 : b.data.label > a.data.label ? -1 : 0)
      );
    });
    return {
      name: 'assignee',
      label: 'Toegekend aan',
      keyProperty: 'label',
      displayProperty: 'label',
      values
    } as SearchFilterCriteriaInterface;
  }

  public sortAndCreateForLearningAreaFilter(tasksWithAssignments) {
    const uniqueLearningAreas = tasksWithAssignments.reduce(
      (acc, twa) => ({
        ...acc,
        [twa.learningAreaId]: twa.learningArea
      }),
      {}
    ) as LearningAreaInterface;

    const uniqueLearningAreasArray = Object.values(uniqueLearningAreas);
    uniqueLearningAreasArray.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );

    return {
      name: 'learningArea',
      label: 'Leergebieden',
      keyProperty: 'id',
      displayProperty: 'name',
      values: uniqueLearningAreasArray.map(la => {
        return {
          data: la,
          visible: true
        } as SearchFilterCriteriaValuesInterface;
      })
    } as SearchFilterCriteriaInterface;
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
    console.log('here');
  }

  public setSortMode(sortMode: TaskSortEnum) {
    this.currentSortMode$.next(sortMode);
  }

  public tasksWithAssignments(stream: string) {}

  private getCurrentTab(): Observable<number> {
    return this.route.queryParams.pipe(map(queryParam => queryParam.tab));
  }

  // TODO: implement handler
  clickDeleteTasks() {}

  // TODO: implement handler
  clickArchiveTasks() {}

  // TODO: implement handler
  clickNewTask() {}

  private resetSorting() {
    this.setSortMode(TaskSortEnum.NAME);
    this.digitalSorting.value = undefined;
    this.paperSorting.value = undefined;
  }

  private sortTasks(
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
      const taskA = a.startDate;
      const taskB = b.startDate;

      // undefined dates at the front of the list
      if (!taskA) return -1;
      if (!taskB) return 1;

      return taskA < taskB ? -1 : taskA > taskB ? 1 : 0;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningAreaInterface } from '@campus/dal';
import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from '@campus/search';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssigneeTypesEnum } from '../../interfaces/Assignee.interface';
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
  public learningAreaFilter$: Observable<SearchFilterCriteriaInterface>;
  public learningAreaFilterPaper$: Observable<SearchFilterCriteriaInterface>;
  public assigneeFilter$: Observable<SearchFilterCriteriaInterface>;
  public assigneeFilterPaper$: Observable<SearchFilterCriteriaInterface>;
  public taskStatusFilter: SearchFilterCriteriaInterface;
  constructor(
    private viewModel: KabasTasksViewModel,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentTab$ = this.getCurrentTab();
    this.tasksWithAssignments$ = this.viewModel.tasksWithAssignments$;
    this.paperTasksWithAssignments$ = this.viewModel.paperTasksWithAssignments$;

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

    //todo swap for real icons
    this.taskStatusFilter = {
      name: 'taskStatus',
      label: 'taak status',
      keyProperty: 'status',
      displayProperty: 'icon',
      values: [
        {
          data: {
            status: 'pending',
            icon: 'pending'
          },
          visible: true
        },
        {
          data: {
            status: 'active',
            icon: 'start'
          },
          visible: true
        },
        {
          data: {
            status: 'finished',
            icon: 'stop'
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
}

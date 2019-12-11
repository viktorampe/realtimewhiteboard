import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from '@campus/search';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
      map(tasksWithAssignments => {
        const uniqueLearningAreas = {};
        tasksWithAssignments.forEach(twa => {
          uniqueLearningAreas[twa.learningAreaId] = twa.learningArea;
        });
        return {
          name: 'learningArea',
          label: 'Leergebieden',
          keyProperty: 'id',
          displayProperty: 'name',
          values: Object.values(uniqueLearningAreas).map(la => {
            return {
              data: la,
              visible: true
            } as SearchFilterCriteriaValuesInterface;
          })
        } as SearchFilterCriteriaInterface;
      })
    );

    this.assigneeFilter$ = this.tasksWithAssignments$.pipe(
      map(tasksWithAssignments => {
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
                id: { type: assignee.type, id: assignee.id }
              },
              visible: true
            } as SearchFilterCriteriaValuesInterface
          ];
        }, []);
        values.sort(function(a, b) {
          return a.data.label > b.data.label
            ? 1
            : b.data.label > a.data.label
            ? -1
            : 0;
        });

        return {
          name: 'assignee',
          label: 'Toegekend aan',
          keyProperty: 'label',
          displayProperty: 'label',
          values
        } as SearchFilterCriteriaInterface;
      })
    );

    this.learningAreaFilterPaper$ = this.paperTasksWithAssignments$.pipe(
      map(tasksWithAssignments => {
        const uniqueLearningAreas = {};
        tasksWithAssignments.forEach(twa => {
          uniqueLearningAreas[twa.learningAreaId] = twa.learningArea;
        });
        console.log(uniqueLearningAreas);
        return {
          name: 'learningArea',
          label: 'Leergebieden',
          keyProperty: 'id',
          displayProperty: 'name',
          values: Object.values(uniqueLearningAreas).map(la => {
            console.log(la);

            return {
              data: la,
              visible: true
            } as SearchFilterCriteriaValuesInterface;
          })
        } as SearchFilterCriteriaInterface;
      })
    );

    this.assigneeFilterPaper$ = this.paperTasksWithAssignments$.pipe(
      map(tasksWithAssignments => {
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
                id: { type: assignee.type, id: assignee.id }
              },
              visible: true
            } as SearchFilterCriteriaValuesInterface
          ];
        }, []);
        values.sort(function(a, b) {
          return a.data.label > b.data.label
            ? 1
            : b.data.label > a.data.label
            ? -1
            : 0;
        });
        return {
          name: 'assignee',
          label: 'Toegekend aan',
          keyProperty: 'label',
          displayProperty: 'label',
          values
        } as SearchFilterCriteriaInterface;
      })
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

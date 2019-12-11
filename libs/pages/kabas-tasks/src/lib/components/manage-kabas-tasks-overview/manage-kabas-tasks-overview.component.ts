import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public assigneeFilter$: Observable<SearchFilterCriteriaInterface>;
  public taskStatusFilter: SearchFilterCriteriaInterface;
  color = 'accent';
  checked = false;
  disabled = false;
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
            console.log(la);
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
        console.log(tasksWithAssignments);
        const assignees = {
          [AssigneeTypesEnum.CLASSGROUP]: new Set(),
          [AssigneeTypesEnum.GROUP]: new Set(),
          [AssigneeTypesEnum.STUDENT]: new Set()
        };
        tasksWithAssignments.forEach(twa => {
          twa.assignees.forEach(ass => {
            assignees[ass.type].add(ass.label);
          });
        });
        const values = [
          ...Array.from(assignees[AssigneeTypesEnum.CLASSGROUP])
            .sort()
            .map(classgroup => {
              return {
                data: { label: classgroup },
                visible: true
              } as SearchFilterCriteriaValuesInterface;
            }),
          ...Array.from(assignees[AssigneeTypesEnum.GROUP])
            .sort()
            .map(group => {
              return {
                data: { label: group },
                visible: true
              } as SearchFilterCriteriaValuesInterface;
            }),
          ...Array.from(assignees[AssigneeTypesEnum.STUDENT])
            .sort()
            .map(student => {
              return {
                data: { label: student },
                visible: true
              } as SearchFilterCriteriaValuesInterface;
            })
        ];

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

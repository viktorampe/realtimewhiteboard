import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public taskItem = {
    startDate: new Date(2019, 11, 1),
    endDate: new Date(2019, 11, 21),
    actions: [
      { label: 'bekijken', handler: () => console.log('bekijken') },
      { label: 'archiveren', handler: () => console.log('archiveren') },
      { label: 'resultaten', handler: () => console.log('resultaten') },
      { label: 'doelenmatrix', handler: () => console.log('doelenmatrix') }
    ],
    assignees: [
      {
        type: AssigneeTypesEnum.CLASSGROUP,
        label: 'Klas 1',
        start: new Date(2019, 11, 1),
        end: new Date(2019, 11, 8)
      },
      {
        type: AssigneeTypesEnum.CLASSGROUP,
        label: 'Klas 2',
        start: new Date(2019, 11, 8),
        end: new Date(2019, 11, 21)
      },
      {
        type: AssigneeTypesEnum.STUDENT,
        label: 'Leerling 1',
        start: new Date(2019, 11, 1),
        end: new Date(2019, 11, 8)
      },
      {
        type: AssigneeTypesEnum.STUDENT,
        label: 'Leerling 2',
        start: new Date(2019, 11, 1),
        end: new Date(2019, 11, 8)
      },
      {
        type: AssigneeTypesEnum.GROUP,
        label: 'Groep 1',
        start: new Date(2019, 11, 8),
        end: new Date(2019, 11, 21)
      }
    ]
  };

  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public currentTab$: Observable<number>;

  constructor(
    private viewModel: KabasTasksViewModel,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentTab$ = this.getCurrentTab();
    this.tasksWithAssignments$ = this.viewModel.tasksWithAssignments$;
    this.paperTasksWithAssignments$ = this.viewModel.paperTasksWithAssignments$;
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

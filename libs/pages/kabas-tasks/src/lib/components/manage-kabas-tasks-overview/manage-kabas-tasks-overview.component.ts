import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';
import { TaskWithAssigneesInterface } from '../kabas-tasks.viewmodel.selectors';

@Component({
  selector: 'campus-manage-kabas-tasks-overview',
  templateUrl: './manage-kabas-tasks-overview.component.html',
  styleUrls: ['./manage-kabas-tasks-overview.component.scss'],

  providers: [
    { provide: KabasTasksViewModel, useClass: MockKabasTasksViewModel }
  ]
})
export class ManageKabasTasksOverviewComponent implements OnInit {
  public isTaskSelected$: Observable<boolean>;
  public currentTab$: Observable<number>;
  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;

  @ViewChild(MatSelectionList)
  private matSelectionList: MatSelectionList;

  constructor(
    private viewModel: KabasTasksViewModel,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentTab$ = this.getCurrentTab();
    this.tasksWithAssignments$ = this.viewModel.tasksWithAssignments$;
    this.paperTasksWithAssignments$ = this.viewModel.paperTasksWithAssignments$;
    this.isTaskSelected$ = this.matSelectionList.selectionChange.pipe(
      map((event: MatSelectionListChange) => {
        return !!event.source.selectedOptions.selected.length;
      })
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
}

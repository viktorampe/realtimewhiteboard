import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterTextInputComponent } from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
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
  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public currentTab$: Observable<number>;

  @ViewChild('digitalTasksTextFilter')
  digitalTasksFilterTextInput: FilterTextInputComponent<
    TaskWithAssigneesInterface[],
    TaskWithAssigneesInterface
  >;
  @ViewChild('paperTasksTextFilter')
  paperTasksFilterTextInput: FilterTextInputComponent<
    TaskWithAssigneesInterface[],
    TaskWithAssigneesInterface
  >;

  constructor(
    private viewModel: KabasTasksViewModel,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    this.currentTab$ = this.getCurrentTab();
    this.tasksWithAssignments$ = this.viewModel.tasksWithAssignments$;
    this.paperTasksWithAssignments$ = this.viewModel.paperTasksWithAssignments$;
    this.digitalTasksFilterTextInput.setFilterableItem(this);
    this.paperTasksFilterTextInput.setFilterableItem(this);
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

  // TODO:
  // text filter: use source stream based on active tab
  // merge all filter results in one stream 'filteredTasks$'

  private getCurrentTab(): Observable<number> {
    return this.route.queryParams.pipe(map(queryParam => queryParam.tab));
  }

  filterFn(
    source: TaskWithAssigneesInterface[],
    searchText: string
  ): TaskWithAssigneesInterface[] {
    return this.filterService.filter(source, { name: searchText });
  }
}

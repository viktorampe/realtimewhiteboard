import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterTextInputComponent } from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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

  @ViewChild('paper') paperTaskList: MatSelectionList;
  @ViewChild('digital') digitalTaskList: MatSelectionList;

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
  // - merge all filter results in one stream 'filteredTasks$'

  private getCurrentTab(): Observable<number> {
    return this.route.queryParams.pipe(
      map(queryParam => {
        if (queryParam.tab === undefined) return 0;
        return +queryParam.tab;
      }),
      tap(tabIndex => {
        this.cleanUpTab(this.getInvisibleTabIndex(tabIndex));
      })
    );
  }

  private getInvisibleTabIndex(currentTabIndex: number): number {
    return currentTabIndex === 0 ? 1 : 0;
  }

  /**
   * When navigating to a different tab, the invisible tab should perform some clean up.
   * E.g. reset filters, selections etc.
   *
   * @private
   * @param {number} tabIndex
   * @memberof ManageKabasTasksOverviewComponent
   */
  private cleanUpTab(tabIndex: number): void {
    this.clearSelectionOnTab(tabIndex);
    this.clearFiltersOnTab(tabIndex);
  }

  private clearFiltersOnTab(tabIndex: number): void {
    if (tabIndex === 0) {
      if (this.digitalTasksFilterTextInput)
        this.digitalTasksFilterTextInput.clear();
    } else if (tabIndex === 1) {
      if (this.paperTasksFilterTextInput)
        this.paperTasksFilterTextInput.clear();
    }
  }

  /**
   * Clears the selected options of the mat-selection-list on the provided tab.
   * Reason: contextual actions are shown when selecting one or multiple tasks.
   * E.g. If tab A has a selected task and we navigate to tab B (which doesn't have a task selected), the contextual actions would still be visible.
   *
   * @private
   * @param {number} tabIndex
   * @memberof ManageKabasTasksOverviewComponent
   */
  private clearSelectionOnTab(tabIndex: number): void {
    if (tabIndex === 0) {
      if (this.digitalTaskList) this.digitalTaskList.selectedOptions.clear();
    } else if (tabIndex === 1) {
      if (this.paperTaskList) this.paperTaskList.selectedOptions.clear();
    }
  }

  filterFn(
    source: TaskWithAssigneesInterface[],
    searchText: string
  ): TaskWithAssigneesInterface[] {
    return this.filterService.filter(source, { name: searchText });
  }
}

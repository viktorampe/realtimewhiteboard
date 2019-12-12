import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MatSelectionList } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesFixture,
  SearchTermComponent
} from '@campus/search';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AssigneeTypesEnum } from '../../interfaces/Assignee.interface';
import { TaskWithAssigneesInterface } from '../../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';

export interface FilterStateInterface {
  searchTerm?: string;
  learningArea?: number[];
  dateInterval?: { start: Date; end: Date };
  assignee?: { id: number; type: AssigneeTypesEnum }[];
  status?: string[];
}

@Component({
  selector: 'campus-manage-kabas-tasks-overview',
  templateUrl: './manage-kabas-tasks-overview.component.html',
  styleUrls: ['./manage-kabas-tasks-overview.component.scss']
})
export class ManageKabasTasksOverviewComponent
  implements OnInit, AfterContentInit {
  public mockFilterCriteria = new SearchFilterCriteriaFixture({}, [
    new SearchFilterCriteriaValuesFixture()
  ]);

  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public currentTab$: Observable<number>;
  public filteredTasks$: Observable<TaskWithAssigneesInterface[]>;

  private filterState$ = new BehaviorSubject<FilterStateInterface>({});

  @ViewChild('paper') paperTaskList: MatSelectionList;
  @ViewChild('digital') digitalTaskList: MatSelectionList;
  @ViewChildren(SearchTermComponent) searchTermFilters: QueryList<
    SearchTermComponent
  >;

  constructor(
    private viewModel: KabasTasksViewModel,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentTab$ = this.getCurrentTab();
    this.tasksWithAssignments$ = this.viewModel.tasksWithAssignments$;
    this.paperTasksWithAssignments$ = this.viewModel.paperTasksWithAssignments$;
  }

  ngAfterContentInit(): void {
    this.filteredTasks$ = this.getFilteredTasks();
    this.cd.detectChanges();
  }

  clickAddDigitalTask() {
    console.log('TODO: adding digital task');
  }
  clickAddPaperTask() {
    console.log('TODO: adding paper task');
  }

  // TODO: implement handler
  clickDeleteTasks() {}

  // TODO: implement handler
  clickArchiveTasks() {}

  // TODO: implement handler
  clickNewTask() {}

  public onSelectedTabIndexChanged(tab: number) {
    this.router.navigate([], {
      queryParams: { tab }
    });
  }

  // TODO:
  // - number of results$
  // - no results view
  // - filter based on:
  //  - stopped/started/not yet started

  public selectionChanged(
    criteria: SearchFilterCriteriaInterface[],
    filterName: string
  ) {
    // array is emitted, but there is only one value
    const criterium = criteria[0];
    // extract selected options from filter
    const selectedOptions = criterium.values
      .filter(value => value.selected)
      .map(selectedValue => selectedValue.data.id);

    const updatedFilter = {};
    updatedFilter[filterName] = selectedOptions;

    this.updateFilterState(updatedFilter);
  }

  public searchTermUpdated(term: string) {
    const updatedFilter = { searchTerm: term };
    this.updateFilterState(updatedFilter);
  }

  private updateFilterState(updatedFilter: FilterStateInterface): void {
    const currentFilterState = this.filterState$.value;
    const newFilterState = { ...currentFilterState, ...updatedFilter };

    this.filterState$.next(newFilterState);
  }

  private getFilteredTasks(): Observable<TaskWithAssigneesInterface[]> {
    return combineLatest([
      this.currentTab$,
      this.filterState$,
      this.tasksWithAssignments$,
      this.paperTasksWithAssignments$
    ]).pipe(
      map(([currentTabIndex, filterState, digitalTasks, paperTasks]) => {
        // to know which task stream we should use
        return this.filterTasks(
          filterState,
          currentTabIndex === 0 ? digitalTasks : paperTasks
        );
      })
    );
  }

  private filterTasks(
    filterState: FilterStateInterface,
    tasks: TaskWithAssigneesInterface[]
  ): TaskWithAssigneesInterface[] {
    if (tasks.length === 0) return [];

    let filteredTasks = [...tasks];

    // apply filters ...

    if (filterState.learningArea && filterState.learningArea.length) {
      // filter on learning areas
      filteredTasks = tasks.filter(task => {
        return filterState.learningArea.includes(task.learningAreaId);
      });
    }

    if (filterState.searchTerm) {
      // filter on term
      filteredTasks = this.filterService.filter(filteredTasks, {
        name: filterState.searchTerm
      });
    }

    if (filterState.status && filterState.status.length) {
      filteredTasks = filteredTasks.filter(task =>
        task.assignees.some(assignee =>
          filterState.status.includes(assignee.status)
        )
      );
    }

    if (filterState.assignee && filterState.assignee.length) {
      const assigneeIdsByTypeMap = filterState.assignee.reduce((acc, cur) => {
        if (!acc[cur.type]) acc[cur.type] = [];
        acc[cur.type].push(cur.id);

        return acc;
      }, {});

      filteredTasks = filteredTasks.filter(task =>
        task.assignees.some(
          taskAssignee =>
            assigneeIdsByTypeMap[taskAssignee.type] &&
            assigneeIdsByTypeMap[taskAssignee.type].includes(taskAssignee.id)
        )
      );
    }

    return filteredTasks;
  }

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
    this.filterState$.next({});
    this.clearSelectionOnTab(tabIndex);
    this.clearFiltersOnTab(tabIndex);
  }

  private clearFiltersOnTab(tabIndex: number): void {
    if (this.searchTermFilters)
      this.searchTermFilters.forEach(filter => (filter.currentValue = ''));
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
}

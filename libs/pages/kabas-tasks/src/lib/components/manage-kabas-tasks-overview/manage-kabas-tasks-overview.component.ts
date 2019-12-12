import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { MatSelectionList } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesFixture,
  SearchTermComponent,
  SelectFilterComponent
} from '@campus/search';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssigneeTypesEnum } from '../../interfaces/Assignee.interface';
import { TaskWithAssigneesInterface } from '../../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';

export interface FilterStateInterface {
  searchTerm?: string;
  learningArea?: number[];
  dateInterval?: { gte: Date; lte: Date };
  assignee?: { id: number; type: AssigneeTypesEnum }[];
  status?: string[];
}

@Component({
  selector: 'campus-manage-kabas-tasks-overview',
  templateUrl: './manage-kabas-tasks-overview.component.html',
  styleUrls: ['./manage-kabas-tasks-overview.component.scss'],
  providers: [
    { provide: KabasTasksViewModel, useClass: MockKabasTasksViewModel }
  ]
})
export class ManageKabasTasksOverviewComponent
  implements OnInit, AfterContentInit {
  // TODO: remove
  public mockFilterCriteria = new SearchFilterCriteriaFixture({}, [
    new SearchFilterCriteriaValuesFixture()
  ]);

  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public currentTab$: Observable<number>;
  public filteredTasks$: Observable<TaskWithAssigneesInterface[]>;

  private filterState$ = new BehaviorSubject<FilterStateInterface>({});

  @ViewChildren(MatSelectionList) taskLists: QueryList<MatSelectionList>;

  @ViewChildren(SearchTermComponent) searchTermFilters: QueryList<
    SearchTermComponent
  >;

  @ViewChildren(SelectFilterComponent) selectFilters: QueryList<
    SelectFilterComponent
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

  clickResetFilters() {
    // reset state
    this.resetFilterState();
    // visually clear selections
    this.clearFilters();
  }

  public onSelectedTabIndexChanged(tab: number) {
    this.cleanUpPage();
    this.router.navigate([], {
      queryParams: { tab }
    });
  }

  // TODO:
  // - filter based on:
  //  - date interval

  public selectionChanged(
    criteria: SearchFilterCriteriaInterface[],
    filterName: string
  ) {
    const updatedFilter = {};

    // array is emitted, but there is only one value
    const criterium = criteria[0];

    if (filterName === 'dateInterval') {
      updatedFilter[filterName] = {
        gte: criterium.values[0].data.gte,
        lte: criterium.values[0].data.lte
      };
    } else if (filterName === 'assignee') {
      updatedFilter[filterName] = criterium.values
        .filter(value => value.selected)
        .map(selectedValue => ({
          id: selectedValue.data.id.id,
          label: selectedValue.data.id.type
        }));
    } else if (filterName === 'status') {
      updatedFilter[filterName] = criterium.values
        .filter(value => value.selected)
        .map(selectedValue => selectedValue.data.status);
    } else {
      const selectedOptions = criterium.values
        .filter(value => value.selected)
        .map(selectedValue => selectedValue.data.id);

      updatedFilter[filterName] = selectedOptions;
    }

    this.updateFilterState(updatedFilter);
  }

  public searchTermUpdated(term: string) {
    const updatedFilter = { searchTerm: term };
    this.updateFilterState(updatedFilter);
  }

  /**
   * Resets all filters.
   *
   * @private
   * @memberof ManageKabasTasksOverviewComponent
   */
  private resetFilterState(): void {
    this.filterState$.next({});
  }

  /**
   * Patches the old filter state with the new filter values.
   *
   * @private
   * @param {FilterStateInterface} updatedFilter
   * @memberof ManageKabasTasksOverviewComponent
   */
  private updateFilterState(updatedFilter: FilterStateInterface): void {
    const currentFilterState = this.filterState$.value;
    const newFilterState = { ...currentFilterState, ...updatedFilter };

    this.filterState$.next(newFilterState);
  }

  /**
   * Assembles the filtered tasks stream.
   *
   * @private
   * @returns {Observable<TaskWithAssigneesInterface[]>}
   * @memberof ManageKabasTasksOverviewComponent
   */
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

  /**
   * Filters the task array based on the filter state.
   *
   * @private
   * @param {FilterStateInterface} filterState
   * @param {TaskWithAssigneesInterface[]} tasks
   * @returns {TaskWithAssigneesInterface[]}
   * @memberof ManageKabasTasksOverviewComponent
   */
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

    if (filterState.dateInterval) {
      console.log(filteredTasks);
      filteredTasks = filteredTasks.filter(task =>
        task.assignees.some(assignee => {
          return (
            assignee.start <= filterState.dateInterval.lte &&
            assignee.end >= filterState.dateInterval.gte
          );
        })
      );
    }

    return filteredTasks;
  }

  private getCurrentTab(): Observable<number> {
    return this.route.queryParams.pipe(
      map(queryParam => {
        if (queryParam.tab === undefined) return 0;
        return +queryParam.tab;
      })
    );
  }

  /**
   * When navigating to a different tab, the page should perform some clean up.
   * E.g. reset filters, selections etc.
   *
   * @private
   * @memberof ManageKabasTasksOverviewComponent
   */
  private cleanUpPage(): void {
    this.resetFilterState();
    this.clearListSelections();
    this.clearFilters();
  }

  /**
   * This will visually clear the filters.
   * E.g. search term wil be empty, selected boxes will be unchecked etc.
   *
   * @private
   * @memberof ManageKabasTasksOverviewComponent
   */
  private clearFilters(): void {
    if (this.searchTermFilters)
      this.searchTermFilters.forEach(filter => (filter.currentValue = ''));
    if (this.selectFilters)
      this.selectFilters.forEach(filter => filter.selectControl.reset());
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
  private clearListSelections(): void {
    if (this.taskLists)
      this.taskLists.forEach(list => list.selectedOptions.clear());
  }
}

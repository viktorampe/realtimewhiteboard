import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatSelectionList } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesFixture,
  SelectFilterComponent
} from '@campus/search';
import { FilterTextInputComponent } from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay, startWith, tap } from 'rxjs/operators';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';
import { TaskWithAssigneesInterface } from '../kabas-tasks.viewmodel.selectors';

interface FilterState {
  searchText?: string;
  learningArea?: number[];
  dateInterval?: { start: Date; end: Date };
  assignees?: number[];
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
  implements OnInit, AfterViewInit {
  public mockFilterCriteria = new SearchFilterCriteriaFixture({}, [
    new SearchFilterCriteriaValuesFixture()
  ]);

  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public currentTab$: Observable<number>;
  public filteredTasks$: Observable<TaskWithAssigneesInterface[]>;

  private learningAreaFilter: SelectFilterComponent;
  private learningAreaFilterSelection$: Observable<number[]>;

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
  @ViewChild('learningAreaSelectFilter')
  set learningAreaSelectFilter(
    learningAreaSelectFilter: SelectFilterComponent
  ) {
    this.learningAreaFilter = learningAreaSelectFilter;
    this.learningAreaFilterSelection$ = this.getLearningAreaSelections();
    if (!this.filteredTasks$) this.filteredTasks$ = this.getFilteredTasks();
  }

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

    this.digitalTasksFilterTextInput.setFilterableItem(this);
    this.paperTasksFilterTextInput.setFilterableItem(this);
  }

  ngAfterViewInit(): void {
    this.learningAreaFilter.filterCriteria = this.mockFilterCriteria;
    this.cd.detectChanges();
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
  // - filter based on:
  //  - text
  //  - learningArea
  //  - date
  //  - assignee
  //  - stopped/started/not yet started

  private getLearningAreaSelections() {
    return this.learningAreaFilter.filterSelectionChange.pipe(
      map((filterCriteria: SearchFilterCriteriaInterface[]) => {
        // array is emitted, but there is only one value
        const criterium = filterCriteria[0];
        // extract selected options from filter
        const selectedOptions = criterium.values
          .filter(value => value.selected)
          .map(selectedValue => selectedValue.data.id);
        return selectedOptions;
      })
    );
  }

  private getFilteredTasks(): Observable<TaskWithAssigneesInterface[]> {
    return combineLatest([
      this.currentTab$,
      this.learningAreaFilterSelection$.pipe(startWith([])),
      this.digitalTasksFilterTextInput.result$,
      this.paperTasksFilterTextInput.result$
    ]).pipe(
      map(
        ([
          currentTabIndex,
          selectedLearningAreas,
          textFilteredDigitalTasks,
          textFilteredPaperTasks
        ]) => {
          const newFilterState: FilterState = {
            learningArea: selectedLearningAreas
          };

          return this.filterTasks(
            newFilterState,
            currentTabIndex === 0
              ? textFilteredDigitalTasks
              : textFilteredPaperTasks
          );
        }
      ),
      shareReplay(1)
    );
  }

  private filterTasks(
    filterState: FilterState,
    tasks: TaskWithAssigneesInterface[]
  ): TaskWithAssigneesInterface[] {
    if (tasks.length === 0) return [];
    let filteredTasks = [...tasks];
    if (filterState.learningArea && filterState.learningArea.length) {
      // filter on learning areas
      filteredTasks = tasks.filter(task => {
        return filterState.learningArea.includes(task.learningAreaId);
      });
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

import {
  AfterContentInit,
  Component,
  Inject,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {
  MatSelectionList,
  MatSlideToggle,
  MatSlideToggleChange
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningAreaInterface } from '@campus/dal';
import {
  ButtonToggleFilterComponent,
  DateFilterComponent,
  RadioOption,
  RadioOptionValueType,
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface,
  SearchTermComponent,
  SelectFilterComponent
} from '@campus/search';
import {
  DateFunctions,
  FilterServiceInterface,
  FILTER_SERVICE_TOKEN
} from '@campus/utils';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AssigneeTypesEnum } from '../../interfaces/Assignee.interface';
import { TaskWithAssigneesInterface } from '../../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';

export interface FilterStateInterface {
  searchTerm?: string;
  learningArea?: number[];
  dateInterval?: { gte?: Date; lte?: Date };
  assignee?: { id: number; type: AssigneeTypesEnum }[];
  status?: string[];
  isArchived?: boolean;
}

@Component({
  selector: 'campus-manage-kabas-tasks-overview',
  templateUrl: './manage-kabas-tasks-overview.component.html',
  styleUrls: ['./manage-kabas-tasks-overview.component.scss']
})
export class ManageKabasTasksOverviewComponent
  implements OnInit, AfterContentInit {
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
  public filteredTasks$: Observable<TaskWithAssigneesInterface[]>;
  public learningAreaFilter$: Observable<SearchFilterCriteriaInterface>;
  public learningAreaFilterPaper$: Observable<SearchFilterCriteriaInterface>;
  public assigneeFilter$: Observable<SearchFilterCriteriaInterface>;
  public assigneeFilterPaper$: Observable<SearchFilterCriteriaInterface>;
  public taskStatusFilter: SearchFilterCriteriaInterface;
  public dateFilterCriteria: SearchFilterCriteriaInterface;
  public fixedDateFilterOptions: RadioOption[] = [
    {
      viewValue: 'Het volledige schooljaar',
      value: {
        type: RadioOptionValueType.FilterCriteriaValue,
        contents: {
          data: {
            gte: new Date(new Date().getFullYear(), 8, 1),
            lte: new Date(new Date().getFullYear() + 1, 5, 30)
          }
        }
      }
    },
    {
      viewValue: 'Deze week',
      value: {
        type: RadioOptionValueType.FilterCriteriaValue,
        contents: {
          data: {
            gte: DateFunctions.startOfWeek(new Date()),
            lte: DateFunctions.endOfWeek(new Date())
          }
        }
      }
    },
    {
      viewValue: 'Vorige week',
      value: {
        type: RadioOptionValueType.FilterCriteriaValue,
        contents: {
          data: {
            gte: DateFunctions.lastWeek(new Date()),
            lte: DateFunctions.endOfWeek(DateFunctions.lastWeek(new Date()))
          }
        }
      }
    }
  ];

  private filterState$ = new BehaviorSubject<FilterStateInterface>({});

  @ViewChildren(MatSelectionList) private taskLists: QueryList<
    MatSelectionList
  >;

  @ViewChildren(SearchTermComponent) private searchTermFilters: QueryList<
    SearchTermComponent
  >;

  @ViewChildren(SelectFilterComponent) private selectFilters: QueryList<
    SelectFilterComponent
  >;
  @ViewChildren(ButtonToggleFilterComponent)
  private buttonToggleFilters: QueryList<ButtonToggleFilterComponent>;
  @ViewChildren(MatSlideToggle) private slideToggleFilters: QueryList<
    MatSlideToggle
  >;
  @ViewChildren(DateFilterComponent) private dateFilters: QueryList<
    DateFilterComponent
  >;

  constructor(
    private viewModel: KabasTasksViewModel,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    this.currentTab$ = this.getCurrentTab();
    console.log(this.viewModel);
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

    this.dateFilterCriteria = {
      name: 'taskDate',
      label: 'Actief van',
      keyProperty: '',
      displayProperty: 'icon',
      values: [
        {
          data: {}
        }
      ]
    };

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
            icon: 'task:pending'
          },
          visible: true
        },
        {
          data: {
            status: 'active',
            icon: 'task:active'
          },
          visible: true
        },
        {
          data: {
            status: 'finished',
            icon: 'task:finished'
          },
          visible: true
        }
      ]
    };
  }

  ngAfterContentInit(): void {
    this.filteredTasks$ = this.getFilteredTasks();
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

  // TODO: implement handler
  clickDeleteTasks() {}

  // TODO: implement handler
  clickArchiveTasks() {}

  // TODO: implement handler
  clickNewTask() {}

  clickResetFilters() {
    // visually clear selections
    this.clearFilters();
  }

  public onSelectedTabIndexChanged(tab: number) {
    this.cleanUpPage();
    this.router.navigate([], {
      queryParams: { tab }
    });
  }

  public archivedFilterToggled(data: MatSlideToggleChange) {
    const updatedFilter: FilterStateInterface = { isArchived: data.checked };
    this.updateFilterState(updatedFilter);
  }

  public selectionChanged(
    criteria: SearchFilterCriteriaInterface[],
    filterName: string
  ) {
    this.updateFilterState(
      this.mapSearchFilterCriteriaToFilterState(criteria, filterName)
    );
  }

  public searchTermUpdated(term: string) {
    const updatedFilter = { searchTerm: term };
    this.updateFilterState(updatedFilter);
  }

  private mapSearchFilterCriteriaToFilterState(
    filterCriteria: SearchFilterCriteriaInterface[],
    filterName: string
  ): FilterStateInterface {
    const updatedFilter: FilterStateInterface = {};

    // array is emitted, but there is only one value
    const criterium = filterCriteria[0];

    if (filterName === 'dateInterval') {
      if (criterium.values[0].data.gte || criterium.values[0].data.lte) {
        updatedFilter[filterName] = {
          gte: criterium.values[0].data.gte,
          lte: criterium.values[0].data.lte
        };
      } else {
        updatedFilter.dateInterval = null;
      }
    } else if (filterName === 'assignee') {
      updatedFilter[filterName] = criterium.values
        .filter(value => value.selected)
        .map(selectedValue => ({
          id: selectedValue.data.identifier.id,
          type: selectedValue.data.identifier.type
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

    return updatedFilter;
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
      debounceTime(10),
      map(([currentTabIndex, filterState, digitalTasks, paperTasks]) => {
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

    // filter on learning areas
    if (filterState.learningArea && filterState.learningArea.length) {
      filteredTasks = this.filterOnLearningAreas(
        filterState.learningArea,
        filteredTasks
      );
    }

    // filter on search term
    if (filterState.searchTerm) {
      filteredTasks = this.filterOnTerm(filterState.searchTerm, filteredTasks);
    }

    // filter on status
    if (filterState.status && filterState.status.length) {
      filteredTasks = this.filterOnStatus(filterState.status, filteredTasks);
    }

    // filter on assignees
    if (filterState.assignee && filterState.assignee.length) {
      filteredTasks = this.filterOnAssignees(
        filterState.assignee,
        filteredTasks
      );
    }

    // filter on date interval
    if (filterState.dateInterval) {
      filteredTasks = this.filterOnDateInterval(
        filterState.dateInterval.gte,
        filterState.dateInterval.lte,
        filteredTasks
      );
    }

    // filter on archived
    if (filterState.isArchived) {
      filteredTasks = this.filterOnArchived(filteredTasks);
    }

    return filteredTasks;
  }

  private filterOnLearningAreas(
    learningAreas: number[],
    tasks: TaskWithAssigneesInterface[]
  ): TaskWithAssigneesInterface[] {
    return tasks.filter(task => {
      return learningAreas.includes(task.learningAreaId);
    });
  }

  private filterOnTerm(
    term: string,
    tasks: TaskWithAssigneesInterface[]
  ): TaskWithAssigneesInterface[] {
    return this.filterService.filter(tasks, {
      name: term
    });
  }

  private filterOnStatus(
    status: string[],
    tasks: TaskWithAssigneesInterface[]
  ): TaskWithAssigneesInterface[] {
    return tasks.filter(task => status.includes(task.status));
  }

  private filterOnAssignees(
    assignees: { id: number; type: AssigneeTypesEnum }[],
    tasks: TaskWithAssigneesInterface[]
  ): TaskWithAssigneesInterface[] {
    const assigneeIdsByTypeMap = assignees.reduce((acc, cur) => {
      if (!acc[cur.type]) acc[cur.type] = [];
      acc[cur.type].push(cur.id);

      return acc;
    }, {});

    return tasks.filter(task =>
      task.assignees.some(
        taskAssignee =>
          assigneeIdsByTypeMap[taskAssignee.type] &&
          assigneeIdsByTypeMap[taskAssignee.type].includes(taskAssignee.id)
      )
    );
  }

  private filterOnDateInterval(
    gte: Date,
    lte: Date,
    tasks: TaskWithAssigneesInterface[]
  ): TaskWithAssigneesInterface[] {
    return tasks.filter(task => {
      if (gte && lte) {
        return task.startDate <= lte && task.endDate >= gte;
      }

      if (gte) {
        return task.endDate >= gte;
      }

      if (lte) {
        return task.startDate <= lte;
      }
    });
  }

  private filterOnArchived(
    tasks: TaskWithAssigneesInterface[]
  ): TaskWithAssigneesInterface[] {
    return tasks.filter(task => !!task.archivedYear);
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
      this.searchTermFilters.forEach(filter => {
        filter.currentValue = '';
        filter.valueChange.next('');
      });
    if (this.selectFilters)
      this.selectFilters.forEach(filter => filter.selectControl.reset());
    if (this.buttonToggleFilters)
      this.buttonToggleFilters.forEach(filter => filter.toggleControl.reset());
    if (this.slideToggleFilters)
      this.slideToggleFilters.forEach(filter => {
        filter.checked = false;
        filter.change.emit({ checked: false, source: filter });
      });
    if (this.dateFilters) this.dateFilters.forEach(filter => filter.reset());
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

import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {
  MatDialog,
  MatSelect,
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
import { ConfirmationModalComponent } from '@campus/ui';
import {
  DateFunctions,
  FilterServiceInterface,
  FILTER_SERVICE_TOKEN
} from '@campus/utils';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay, take } from 'rxjs/operators';
import { AssigneeTypesEnum } from '../../interfaces/Assignee.interface';
import { Source } from '../../interfaces/Source.type';
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

export enum TaskSortEnum {
  'NAME' = 'NAME',
  'LEARNINGAREA' = 'LEARNINGAREA',
  'STARTDATE' = 'STARTDATE',
  'FAVORITE' = 'FAVORITE'
}

@Component({
  selector: 'campus-manage-kabas-tasks-overview',
  templateUrl: './manage-kabas-tasks-overview.component.html',
  styleUrls: ['./manage-kabas-tasks-overview.component.scss']
})
export class ManageKabasTasksOverviewComponent implements OnInit {
  public TaskSortEnum = TaskSortEnum;
  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public currentTab$: Observable<number>;
  public digitalFilteredTasks$: Observable<TaskWithAssigneesInterface[]>;
  public paperFilteredTasks$: Observable<TaskWithAssigneesInterface[]>;
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

  public isArchivedFilterActive: boolean;

  private digitalFilterState$ = new BehaviorSubject<FilterStateInterface>({});
  private paperFilterState$ = new BehaviorSubject<FilterStateInterface>({});

  @ViewChildren(MatSelectionList) public taskLists: QueryList<MatSelectionList>;

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

  private currentSortMode$ = new BehaviorSubject(TaskSortEnum.NAME);

  @ViewChild('digitalSorting', { static: true })
  private digitalSorting: MatSelect;
  @ViewChild('paperSorting', { static: true }) private paperSorting: MatSelect;

  constructor(
    private viewModel: KabasTasksViewModel,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface,
    private cd: ChangeDetectorRef,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentTab$ = this.getCurrentTab();
    this.digitalFilteredTasks$ = this.getFilteredDigitalTasks().pipe(
      shareReplay(1)
    );
    this.paperFilteredTasks$ = this.getFilteredPaperTasks().pipe(
      shareReplay(1)
    );

    this.tasksWithAssignments$ = combineLatest([
      this.digitalFilteredTasks$,
      this.currentSortMode$
    ]).pipe(map(([tasks, sortMode]) => this.sortTasks(tasks, sortMode)));

    this.paperTasksWithAssignments$ = combineLatest([
      this.paperFilteredTasks$,
      this.currentSortMode$
    ]).pipe(map(([tasks, sortMode]) => this.sortTasks(tasks, sortMode)));

    this.learningAreaFilter$ = this.viewModel.tasksWithAssignments$.pipe(
      map(this.sortAndCreateForLearningAreaFilter)
    );
    this.assigneeFilter$ = this.viewModel.tasksWithAssignments$.pipe(
      map(this.sortAndCreateForAssigneeFilter)
    );
    this.learningAreaFilterPaper$ = this.viewModel.paperTasksWithAssignments$.pipe(
      map(this.sortAndCreateForLearningAreaFilter)
    );

    this.assigneeFilterPaper$ = this.viewModel.paperTasksWithAssignments$.pipe(
      map(this.sortAndCreateForAssigneeFilter)
    );

    this.dateFilterCriteria = {
      name: 'taskDate',
      label: 'Actief vanaf',
      keyProperty: '',
      displayProperty: 'icon',
      values: [
        {
          data: {}
        }
      ]
    };

    this.taskStatusFilter = {
      name: 'taskStatus',
      label: 'taak status',
      keyProperty: 'status',
      displayProperty: 'icon',
      values: [
        {
          data: {
            status: 'pending',
            icon: 'filter:pending'
          },
          visible: true
        },
        {
          data: {
            status: 'active',
            icon: 'filter:active'
          },
          visible: true
        },
        {
          data: {
            status: 'finished',
            icon: 'filter:finished'
          },
          visible: true
        }
      ]
    };
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

  public getActions(
    task?: TaskWithAssigneesInterface
  ): { label: string; handler: Function }[] {
    return [
      {
        label: 'bekijken',
        handler: () => this.router.navigate(['tasks', 'manage', task.id])
      },
      {
        label: task && task.archivedYear ? 'dearchiveren' : 'archiveren',
        handler: () =>
          console.log(task.archivedYear ? 'dearchiveren' : 'archiveren')
      },
      { label: 'resultaten', handler: () => console.log('resultaten') },
      { label: 'doelenmatrix', handler: () => console.log('doelenmatrix') }
    ];
  }

  clickAddDigitalTask() {
    this.navigateToNew();
  }
  clickAddPaperTask() {
    this.navigateToNew('paper');
  }
  // TODO: implement handler
  clickDeleteTasks() {
    const dialogData = {
      title: 'Taken verwijderen',
      message: 'Ben je zeker dat je de geselecteerde taken wil verwijderen?'
    };

    const dialogRef = this.matDialog.open(ConfirmationModalComponent, {
      data: dialogData
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(confirmed => confirmed),
        take(1)
      )
      .subscribe(() => this.deleteTasks());
  }

  public deleteTasks() {
    this.viewModel.removeTasks(this.getSelectedTasks());
  }

  clickArchiveTasks() {
    this.viewModel.startArchivingTasks(this.getSelectedTasks(), true);
  }

  clickUnarchiveTasks() {
    this.viewModel.startArchivingTasks(this.getSelectedTasks(), false);
  }

  clickNewTask() {
    const { tab: currentTab } = this.route.snapshot.queryParams;
    if (!currentTab || +currentTab === 0) {
      this.navigateToNew('digital');
    } else {
      this.navigateToNew('paper');
    }
  }

  private navigateToNew(type: Source = 'digital') {
    this.router.navigate(['tasks', 'manage', 'new'], {
      queryParams: { [type]: true }
    });
  }

  clickResetFilters(mode?: string) {
    // visually clear selections
    this.clearFilters();
  }

  clickToggleFavorite(task: TaskWithAssigneesInterface) {
    this.viewModel.toggleFavorite(task);
  }

  private getSelectedTasks(): TaskWithAssigneesInterface[] {
    if (this.taskLists) {
      return this.taskLists.reduce((acc, list) => {
        return [
          ...acc,
          ...list.selectedOptions.selected.map(option => option.value)
        ];
      }, []);
    }
  }

  public onSelectedTabIndexChanged(tab: number) {
    this.cleanUpTab();
    this.router.navigate([], {
      queryParams: { tab }
    });

    // needed because tab switching causes
    // expression changed after view checked
    // re-attach when animtion is done
    this.cd.detach();
  }

  public onTabAnimationDone() {
    this.cd.reattach();
    this.cd.detectChanges();
  }

  public archivedFilterToggled(data: MatSlideToggleChange, type: Source) {
    const filterValues: FilterStateInterface = { isArchived: data.checked };

    // when archived is active, the status filter should be reset and disabled
    this.clearButtonToggleFilters();
    this.isArchivedFilterActive = data.checked;

    if (type === 'digital') this.updateDigitalFilterState(filterValues);
    if (type === 'paper') this.updatePaperFilterState(filterValues);
  }

  public selectionChanged(
    criteria: SearchFilterCriteriaInterface[],
    filterName: string,
    type: Source
  ) {
    const filterValues = this.mapSearchFilterCriteriaToFilterState(
      criteria,
      filterName
    );
    if (type === 'digital') this.updateDigitalFilterState(filterValues);
    if (type === 'paper') this.updatePaperFilterState(filterValues);
  }

  public searchTermUpdated(term: string, type: Source) {
    const filterValues = { searchTerm: term };

    if (type === 'digital') this.updateDigitalFilterState(filterValues);
    if (type === 'paper') this.updatePaperFilterState(filterValues);
  }

  public setSortMode(sortMode: TaskSortEnum) {
    this.currentSortMode$.next(sortMode);
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
  private updateDigitalFilterState(updatedFilter: FilterStateInterface): void {
    const currentFilterState = this.digitalFilterState$.value;
    const newFilterState = { ...currentFilterState, ...updatedFilter };

    this.digitalFilterState$.next(newFilterState);
  }

  private updatePaperFilterState(updatedFilter: FilterStateInterface): void {
    const currentFilterState = this.paperFilterState$.value;
    const newFilterState = { ...currentFilterState, ...updatedFilter };

    this.paperFilterState$.next(newFilterState);
  }

  /**
   * Assembles the filtered tasks stream.
   *
   * @private
   * @returns {Observable<TaskWithAssigneesInterface[]>}
   * @memberof ManageKabasTasksOverviewComponent
   */
  private getFilteredDigitalTasks(): Observable<TaskWithAssigneesInterface[]> {
    return combineLatest([
      this.digitalFilterState$,
      this.viewModel.tasksWithAssignments$
    ]).pipe(
      map(([filterState, digitalTasks]) => {
        return this.filterTasks(filterState, digitalTasks);
      })
    );
  }

  private getFilteredPaperTasks(): Observable<TaskWithAssigneesInterface[]> {
    return combineLatest([
      this.paperFilterState$,
      this.viewModel.paperTasksWithAssignments$
    ]).pipe(
      map(([filterState, paperTasks]) => {
        return this.filterTasks(filterState, paperTasks);
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
    filteredTasks = this.filterOnArchived(
      filteredTasks,
      !!filterState.isArchived
    );

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
    tasks: TaskWithAssigneesInterface[],
    archived?: boolean
  ): TaskWithAssigneesInterface[] {
    return archived
      ? tasks.filter(task => !!task.archivedYear)
      : tasks.filter(task => !task.archivedYear);
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
  private cleanUpTab(): void {
    this.clearListSelections();
    this.clearFilters();
    this.resetSorting();
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
      this.searchTermFilters.forEach(searchTermFilter => {
        searchTermFilter.currentValue = '';
        searchTermFilter.valueChange.next('');
      });
    if (this.selectFilters)
      this.selectFilters.forEach(selectFilter =>
        selectFilter.selectControl.reset()
      );
    this.clearButtonToggleFilters();
    if (this.slideToggleFilters)
      this.slideToggleFilters.forEach(slideToggleFilter => {
        slideToggleFilter.checked = false;
        slideToggleFilter.change.emit({
          checked: false,
          source: slideToggleFilter
        });
      });
    if (this.dateFilters)
      this.dateFilters.forEach(dateFilter => dateFilter.reset());
  }

  private clearButtonToggleFilters(): void {
    if (this.buttonToggleFilters)
      this.buttonToggleFilters.forEach(buttonToggleFilter =>
        buttonToggleFilter.toggleControl.reset()
      );
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

  private resetSorting() {
    this.setSortMode(TaskSortEnum.NAME);
    this.digitalSorting.value = undefined;
    this.paperSorting.value = undefined;
  }

  private sortTasks(
    tasks: TaskWithAssigneesInterface[],
    sortMode: TaskSortEnum
  ) {
    switch (sortMode) {
      case TaskSortEnum.NAME:
        return this.sortByName([...tasks]);
      case TaskSortEnum.LEARNINGAREA:
        return this.sortByLearningArea([...tasks]);
      case TaskSortEnum.STARTDATE:
        return this.sortByStartDate([...tasks]);
      case TaskSortEnum.FAVORITE:
        return tasks.sort(this.nameComparer).sort(this.favoriteComparer);
    }
    // no sortMode -> no sorting
    return tasks;
  }

  private sortByName(tasks: TaskWithAssigneesInterface[]) {
    return tasks.sort(this.nameComparer);
  }

  private sortByLearningArea(tasks: TaskWithAssigneesInterface[]) {
    return tasks.sort((a, b) => {
      const lA = a.learningArea.name.localeCompare(
        b.learningArea.name,
        'be-nl',
        {
          sensitivity: 'base'
        }
      );
      return (
        lA ||
        a.name.localeCompare(b.name, 'be-nl', {
          sensitivity: 'base'
        })
      );
    });
  }

  private sortByStartDate(tasks: TaskWithAssigneesInterface[]) {
    return tasks.sort((a, b) => {
      const taskA = a.startDate;
      const taskB = b.startDate;

      // undefined dates at the front of the list
      if (!taskA) return -1;
      if (!taskB) return 1;

      return taskA.getTime() - taskB.getTime();
    });
  }

  private favoriteComparer(a, b): number {
    return b.isFavorite - a.isFavorite;
  }

  private nameComparer(a, b): number {
    return a.name.localeCompare(b.name, 'nl-BE', {
      sensitivity: 'base'
    });
  }
}

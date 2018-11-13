import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/shared';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { LearningAreaInterface } from './../../../../../../dal/src/lib/+models/LearningArea.interface';
import { TasksViewModel } from './../tasks.viewmodel';
import { LearningAreasWithTaskInstanceInfoInterface } from './../tasks.viewmodel.interfaces';

@Component({
  selector: 'campus-tasks-area',
  templateUrl: './tasks-area.component.html',
  styleUrls: ['./tasks-area.component.scss']
})
export class TasksAreaComponent implements OnInit {
  protected listFormat = ListFormat;
  filterInput$ = new BehaviorSubject<string>('');
  listFormat$: Observable<ListFormat>;
  learningAreasWithInfo$: Observable<
    LearningAreasWithTaskInstanceInfoInterface
  >;
  // displayedLearningAreasWithInfo$: Observable<
  //   LearningAreasWithTaskInstanceInfoInterface
  // >;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    LearningAreasWithTaskInstanceInfoInterface,
    {
      learningArea: LearningAreaInterface;
      openTasks: number;
      closedTasks: number;
    }
  >;

  constructor(
    private tasksViewModel: TasksViewModel,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    this.listFormat$ = this.tasksViewModel.listFormat$;
    this.learningAreasWithInfo$ = this.tasksViewModel.learningAreasWithTaskInstances$;
    // this.displayedLearningAreasWithInfo$ = this.getDisplayedLearningAreas$(
    //   this.learningAreasWithInfo$,
    //   this.filterInput$
    // );
    this.filterTextInput.filterFn = this.filterFn.bind(this);
  }

  // onChangeFilterInput(filterInput: string): void {
  //   this.filterInput$.next(filterInput);
  // }

  // resetFilterInput(): void {
  //   this.filterInput$.next('');
  // }

  clickChangeListFormat(value: ListFormat): void {
    this.tasksViewModel.changeListFormat(value);
  }

  // getDisplayedLearningAreas$(
  //   learningAreas$: Observable<LearningAreasWithTaskInstanceInfoInterface>,
  //   filterInput$: Observable<string>
  // ): Observable<LearningAreasWithTaskInstanceInfoInterface> {
  //   return combineLatest(learningAreas$, filterInput$).pipe(
  //     map(
  //       ([learningAreas, filterInput]: [
  //         LearningAreasWithTaskInstanceInfoInterface,
  //         string
  //       ]) => {
  //         if (!filterInput) {
  //           return learningAreas;
  //         }

  //         const learningAreaArray = learningAreas.learningAreasWithInfo.filter(
  //           learningAreaWithInfo =>
  //             learningAreaWithInfo.learningArea.name
  //               .toLowerCase()
  //               .includes(filterInput.toLowerCase())
  //         );

  //         const learningAreaWithTaskInstanceInfo = {
  //           ...learningAreas,
  //           learningAreasWithInfo: learningAreaArray
  //         };

  //         return learningAreaWithTaskInstanceInfo;
  //       }
  //     )
  //   );
  // }

  private filterFn(
    info: LearningAreasWithTaskInstanceInfoInterface,
    searchText: string
  ): // interface is defined as part of LearningAreasWithTaskInstanceInfoInterface
  {
    learningArea: LearningAreaInterface;
    openTasks: number;
    closedTasks: number;
  }[] {
    return this.filterService.filter(info.learningAreasWithInfo, {
      learningArea: { name: searchText }
    });
  }
}

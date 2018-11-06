import { Component, OnInit } from '@angular/core';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TasksViewModel } from './../tasks.viewmodel';
import { LearningAreasWithTaskInstanceInfoInterface } from './../tasks.viewmodel.interfaces';

@Component({
  selector: 'campus-tasks-area',
  templateUrl: './tasks-area.component.html',
  styleUrls: ['./tasks-area.component.scss']
})
export class TasksAreaComponent implements OnInit {
  filterInput$ = new BehaviorSubject<string>('');
  listFormat$: Observable<ListFormat>;
  learningAreas$: Observable<LearningAreasWithTaskInstanceInfoInterface>;
  displayedLearningAreas$: Observable<
    LearningAreasWithTaskInstanceInfoInterface
  >;

  constructor(private tasksViewModel: TasksViewModel) {}

  ngOnInit() {
    this.listFormat$ = this.tasksViewModel.listFormat$;
    this.learningAreas$ = this.tasksViewModel.learningAreasWithTaskInstances$;
    // TODO find out why learningarea name is not displayed
    this.displayedLearningAreas$ = this.getDisplayedLearningAreas$(
      this.learningAreas$,
      this.filterInput$
    );
  }

  onChangeFilterInput(filterInput: string): void {
    this.filterInput$.next(filterInput);
  }

  resetFilterInput(): void {
    this.filterInput$.next('');
  }

  clickChangeListFormat(value: string): void {
    // this.tasksViewModel.changeListFormat(ListFormat[value]);
  }

  getDisplayedLearningAreas$(
    learningAreas$: Observable<LearningAreasWithTaskInstanceInfoInterface>,
    filterInput$: Observable<string>
  ): Observable<LearningAreasWithTaskInstanceInfoInterface> {
    return combineLatest(learningAreas$, filterInput$).pipe(
      map(
        ([learningAreas, filterInput]: [
          LearningAreasWithTaskInstanceInfoInterface,
          string
        ]) => {
          if (!filterInput) {
            return learningAreas;
          }

          const learningAreaArray = learningAreas.learningAreas.filter(
            learningArea =>
              learningArea.learningArea.name
                .toLowerCase()
                .includes(filterInput.toLowerCase())
          );

          let learningAreaWithTaskInstanceInfo: LearningAreasWithTaskInstanceInfoInterface;
          learningAreaWithTaskInstanceInfo = {
            learningAreas: learningAreaArray,
            totalTasks: learningAreaArray.reduce(
              (total, area) => total + area.openTasks + area.closedTasks,
              0
            )
          };

          return learningAreaWithTaskInstanceInfo;
        }
      )
    );
  }
}

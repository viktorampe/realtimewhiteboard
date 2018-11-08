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
  protected listFormat = ListFormat;
  filterInput$ = new BehaviorSubject<string>('');
  listFormat$: Observable<ListFormat>;
  learningAreasWithInfo$: Observable<
    LearningAreasWithTaskInstanceInfoInterface
  >;
  displayedLearningAreasWithInfo$: Observable<
    LearningAreasWithTaskInstanceInfoInterface
  >;

  constructor(private tasksViewModel: TasksViewModel) {}

  ngOnInit() {
    this.listFormat$ = this.tasksViewModel.listFormat$;
    this.learningAreasWithInfo$ = this.tasksViewModel.learningAreasWithTaskInstances$;
    this.displayedLearningAreasWithInfo$ = this.getDisplayedLearningAreas$(
      this.learningAreasWithInfo$,
      this.filterInput$
    );
  }

  onChangeFilterInput(filterInput: string): void {
    this.filterInput$.next(filterInput);
  }

  resetFilterInput(): void {
    this.filterInput$.next('');
  }

  clickChangeListFormat(value: ListFormat): void {
    this.tasksViewModel.changeListFormat(value);
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

          const learningAreaArray = learningAreas.learningAreasWithInfo.filter(
            learningAreaWithInfo =>
              learningAreaWithInfo.learningArea.name
                .toLowerCase()
                .includes(filterInput.toLowerCase())
          );

          const learningAreaWithTaskInstanceInfo = {
            ...learningAreas,
            learningAreas: learningAreaArray
          };

          return learningAreaWithTaskInstanceInfo;
        }
      )
    );
  }
}

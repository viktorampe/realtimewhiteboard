import { Component, OnInit } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TasksViewModel } from './../tasks.viewmodel';

@Component({
  selector: 'campus-tasks-area',
  templateUrl: './tasks-area.component.html',
  styleUrls: ['./tasks-area.component.scss']
})
export class TasksAreaComponent implements OnInit {
  filterInput$ = new BehaviorSubject<string>('');
  listFormat$: Observable<ListFormat>;
  learningAreas$: Observable<LearningAreaInterface[]>;
  displayedLearningAreas$: Observable<LearningAreaInterface[]>;

  constructor(private tasksViewModel: TasksViewModel) {}

  ngOnInit() {
    // this.listFormat$ = this.tasksViewModel.listFormat$;
    // this.learningAreas$ = this.tasksViewModel.learningAreas$;
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
    learningAreas$: Observable<LearningAreaInterface[]>,
    filterInput$: Observable<string>
  ): Observable<LearningAreaInterface[]> {
    return combineLatest(learningAreas$, filterInput$).pipe(
      map(([learningAreas, filterInput]: [LearningAreaInterface[], string]) => {
        if (!filterInput) {
          return learningAreas;
        }
        return learningAreas.filter(learningArea =>
          learningArea.name.toLowerCase().includes(filterInput.toLowerCase())
        );
      })
    );
  }
}

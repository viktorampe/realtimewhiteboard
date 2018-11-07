import { Component, OnInit } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TasksViewModel } from './tasks.viewmodel';
import { TaskInstancesWithEduContentInfoInterface } from './tasks.viewmodel.interfaces';

@Component({
  selector: 'campus-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  listFormat$: Observable<ListFormat> = this.viewModel.listFormat$;
  filterInput$ = new BehaviorSubject<string>('');

  taskInstances$: Observable<TaskInstancesWithEduContentInfoInterface> = this
    .viewModel.taskInstancesByLearningArea$;

  displayedTaskInstances$: Observable<
    TaskInstancesWithEduContentInfoInterface
  > = this.getDisplayedTaskInstances(this.taskInstances$, this.filterInput$);

  learningArea$: Observable<LearningAreaInterface> = this.viewModel
    .selectedLearningArea$;

  constructor(private viewModel: TasksViewModel) {}

  ngOnInit() {}

  /**
   * changes the filter's input
   *
   * @param {string} filterInput
   * @memberof TasksComponent
   */
  onChangeFilterInput(filterInput: string): void {
    this.filterInput$.next(filterInput);
  }

  /**
   * resets filter's input
   *
   * @memberof TasksComponent
   */
  resetFilterInput(): void {
    this.filterInput$.next('');
  }

  setListFormat(format: ListFormat) {
    this.viewModel.changeListFormat(format);
  }

  /**
   * get list of filtered taskinstances
   *
   * @param {Observable<TaskInstancesWithEduContentInfo>} bundles$
   * @param {BehaviorSubject<string>} filterInput$
   * @returns {Observable<TaskInstancesWithEduContentInfo>}
   * @memberof TasksComponent
   */
  private getDisplayedTaskInstances(
    taskInstances$: Observable<TaskInstancesWithEduContentInfoInterface>,
    filterInput$: BehaviorSubject<string>
  ): Observable<TaskInstancesWithEduContentInfoInterface> {
    return combineLatest(taskInstances$, filterInput$).pipe(
      map(
        ([taskInstances, filterInput]: [
          TaskInstancesWithEduContentInfoInterface,
          string
        ]) => {
          if (!filterInput || filterInput === '') {
            return taskInstances;
          }
          return {
            instances: taskInstances.instances.filter(instance =>
              instance.taskInstance.task.name
                .toLowerCase()
                .includes(filterInput.toLowerCase())
            )
          };
        }
      )
    );
  }

  getIcon(finished: boolean): string {
    return finished ? 'checkmark' : '';
  }

  getProgress(start: Date, end: Date): number {
    if (start && end) {
      const full: number = end.getTime() - start.getTime();
      if (full < 0) {
        return 0;
      }
      const current: number = this.getDate().getTime() - start.getTime();
      if (full === 0) {
        return 100;
      }
      if (current < 0) {
        return 100;
      } else {
        const percent = Math.round((current / full) * 100);
        if (percent > 100) {
          return 100;
        }
      }
    }
    return 0;
  }

  getDate(): Date {
    return new Date();
  }

  getDeadLineString(end: Date): string {
    if (end) {
      const MM = (end.getMonth() + 1).toString();
      const dd = end.getDate().toString();
      const yy = end
        .getFullYear()
        .toString()
        .substr(2, 2);
      const hh = end.getHours().toString();
      const mm = end.getMinutes().toString();
      return dd + '/' + MM + '/' + yy + ' ' + hh + ':' + mm;
    }
    return '';
  }
}

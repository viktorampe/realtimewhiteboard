import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/shared';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { TasksViewModel } from '../tasks.viewmodel';
import { TaskInstancesWithEduContentInfoInterface } from '../tasks.viewmodel.interfaces';

@Component({
  selector: 'campus-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  listFormat$: Observable<ListFormat> = this.viewModel.listFormat$;

  taskInstances$: Observable<TaskInstancesWithEduContentInfoInterface> = this
    .viewModel.taskInstancesByLearningArea$;

  /*displayedTaskInstances$: Observable<
    TaskInstancesWithEduContentInfoInterface
  > = this.getDisplayedTaskInstances(this.taskInstances$, this.filterInput$);*/

  learningArea$: Observable<LearningAreaInterface> = this.viewModel
    .selectedLearningArea$;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    TaskInstancesWithEduContentInfoInterface,
    TaskInstancesWithEduContentInfoInterface
  >;

  constructor(
    private viewModel: TasksViewModel,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    this.filterTextInput.filterFn = this.filterFn.bind(this);
  }

  setListFormat(format: ListFormat) {
    this.viewModel.changeListFormat(format);
  }

  filterFn(
    source: TaskInstancesWithEduContentInfoInterface,
    searchText: string
  ): TaskInstancesWithEduContentInfoInterface {
    const instances = this.filterService.filter(source.instances, {
      taskInstance: {
        task: { name: searchText }
      }
    });
    return { instances };
  }

  /**
   * get list of filtered taskinstances
   *
   * @param {Observable<TaskInstancesWithEduContentInfo>} bundles$
   * @param {BehaviorSubject<string>} filterInput$
   * @returns {Observable<TaskInstancesWithEduContentInfo>}
   * @memberof TasksComponent
   */
  /*private getDisplayedTaskInstances(
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
  }*/

  getIcon(finished: boolean): string {
    return finished ? 'icon-checkmark' : '';
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

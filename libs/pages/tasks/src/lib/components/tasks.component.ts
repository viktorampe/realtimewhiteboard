import { Component, OnInit } from '@angular/core';
import { TaskInstanceInterface } from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TasksViewModel } from './tasks.viewmodel';

interface TaskInstancesWithEduContentInfo {
  instances: {
    taskInstance: TaskInstanceInterface;
    taskEduContentsCount: number;
    finished: boolean;
  }[];
}

@Component({
  selector: 'campus-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  //listFormat$: Observable<ListFormat> = this.viewmodel.listFormat$;
  filterInput$ = new BehaviorSubject<string>('');
  taskInstances$: Observable<TaskInstancesWithEduContentInfo>;
  displayedTaskInstances$: Observable<TaskInstancesWithEduContentInfo>;

  constructor(private viewModel: TasksViewModel) {
    const taskinstances: TaskInstancesWithEduContentInfo = {
      instances: [
        {
          taskInstance: {
            start: new Date(),
            end: new Date(),
            alerted: false,
            id: 0,
            task: {
              name: 'task'
            }
          },
          taskEduContentsCount: 4,
          finished: false
        },
        {
          taskInstance: {
            start: new Date(),
            end: new Date(),
            alerted: false,
            id: 0,
            task: {
              name: 'task'
            }
          },
          taskEduContentsCount: 4,
          finished: false
        },
        {
          taskInstance: {
            start: new Date(),
            end: new Date(),
            alerted: false,
            id: 0,
            task: {
              name: 'task'
            }
          },
          taskEduContentsCount: 4,
          finished: false
        },
        {
          taskInstance: {
            start: new Date(),
            end: new Date(),
            alerted: false,
            id: 0,
            task: {
              name: 'task'
            }
          },
          taskEduContentsCount: 4,
          finished: false
        },
        {
          taskInstance: {
            start: new Date(),
            end: new Date(),
            alerted: false,
            id: 0,
            task: {
              name: 'task'
            }
          },
          taskEduContentsCount: 4,
          finished: false
        }
      ]
    };

    this.taskInstances$ = of(taskinstances);
    this.displayedTaskInstances$ = this.getDisplayedTaskInstances(
      this.taskInstances$,
      this.filterInput$
    );
  }

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

  //todo
  setListFormat(format: ListFormat) {
    //this.viewmodel.changeListFormat(format);
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
    taskInstances$: Observable<TaskInstancesWithEduContentInfo>,
    filterInput$: BehaviorSubject<string>
  ): Observable<TaskInstancesWithEduContentInfo> {
    return combineLatest(taskInstances$, filterInput$).pipe(
      map(
        ([taskInstances, filterInput]: [
          TaskInstancesWithEduContentInfo,
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

  getDeadLineString(taskInstance: TaskInstanceInterface): string {
    if (taskInstance.end) {
      const MM = (taskInstance.end.getMonth() + 1).toString();
      const dd = taskInstance.end.getDate().toString();
      const yy = taskInstance.end
        .getFullYear()
        .toString()
        .substr(2, 2);
      const hh = taskInstance.end.getHours().toString();
      const mm = taskInstance.end.getMinutes().toString();
      return dd + '/' + MM + '/' + yy + ' ' + hh + ':' + mm;
    }
    return '';
  }
}

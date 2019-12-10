import { Injectable } from '@angular/core';
import { DalState } from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  TaskDatesInterface,
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from '../interfaces/TaskWithAssignees.interface';
import { getTasksWithAssignments } from './kabas-tasks.viewmodel.selectors';

@Injectable({
  providedIn: 'root'
})
export class KabasTasksViewModel {
  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;

  constructor(private store: Store<DalState>) {
    this.tasksWithAssignments$ = this.store.pipe(
      select(getTasksWithAssignments, { isPaper: false })
    );

    this.paperTasksWithAssignments$ = this.store.pipe(
      select(getTasksWithAssignments, { isPaper: true })
    );
  }
}

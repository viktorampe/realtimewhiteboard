import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskWithAssigneesInterface } from './kabas-tasks.viewmodel.selectors';
@Injectable({
  providedIn: 'root'
})
export class KabasTasksViewModel {
  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
}

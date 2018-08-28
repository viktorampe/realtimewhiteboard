import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TasksViewModel } from './tasks.viewmodel';

@Injectable()
export class TasksResolver implements Resolve<boolean> {
  constructor(private tasksViewModel: TasksViewModel) {}

  resolve(): Observable<boolean> {
    return this.tasksViewModel.initialize().pipe(take(1));
  }
}

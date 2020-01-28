import { Injectable } from '@angular/core';
import { PersonApi, TaskEduContentApi } from '@diekeure/polpo-api-angular-sdk';
import { forkJoin, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { TaskEduContentInterface } from '../+models';
import {
  TaskEduContentServiceInterface,
  UpdateTaskEduContentResultInterface
} from './task-edu-content.service.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskEduContentService implements TaskEduContentServiceInterface {
  constructor(
    private personApi: PersonApi,
    private taskEduContentApi: TaskEduContentApi
  ) {}

  getAllForUser(userId: number): Observable<TaskEduContentInterface[]> {
    return this.personApi
      .getData(userId, 'taskEduContents')
      .pipe(
        map(
          (res: { taskEduContents: TaskEduContentInterface[] }) =>
            res.taskEduContents
        )
      );
  }

  // don't use this in Kabas
  remove(taskEduContentId: number): Observable<boolean> {
    return this.taskEduContentApi
      .deleteById(taskEduContentId)
      .pipe(mapTo(true));
  }

  // don't use this in Kabas
  removeAll(taskEduContentIds: number[]): Observable<boolean> {
    return forkJoin(taskEduContentIds.map(id => this.remove(id))).pipe(
      mapTo(true)
    );
  }

  updateTaskEduContents(
    userId: number,
    update: Partial<TaskEduContentInterface>[]
  ): Observable<UpdateTaskEduContentResultInterface> {
    return this.taskEduContentApi.updateTaskEduContents(update) as Observable<
      UpdateTaskEduContentResultInterface
    >;
  }

  deleteTaskEduContents(
    userId: number,
    taskEduContentIds: number[]
  ): Observable<UpdateTaskEduContentResultInterface> {
    return this.taskEduContentApi.destroyTaskEduContents(
      taskEduContentIds
    ) as Observable<UpdateTaskEduContentResultInterface>;
  }
}

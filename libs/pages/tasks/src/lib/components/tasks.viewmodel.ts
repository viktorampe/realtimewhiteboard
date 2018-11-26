import { Injectable } from '@angular/core';
import { LearningAreaInterface, TaskInstanceInterface } from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { Observable, of } from 'rxjs';
import {
  LearningAreasWithTaskInstanceInfoInterface,
  TaskInstancesWithEduContentInfoInterface,
  TaskInstanceWithEduContentsInfoInterface
} from './tasks.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
// implements TasksResolver
export class TasksViewModel {
  learningAreasWithTaskInstances$: Observable<
    LearningAreasWithTaskInstanceInfoInterface
  >;
  selectedLearningArea$: Observable<LearningAreaInterface>;
  taskInstancesByLearningArea$: Observable<
    TaskInstancesWithEduContentInfoInterface
  >;
  selectedTaskInstance$: Observable<TaskInstanceInterface>;
  taskInstanceWithEduContents$: Observable<
    TaskInstanceWithEduContentsInfoInterface
  >;
  listFormat$: Observable<ListFormat>;
  // routeParams$: TODO type?

  constructor() {}

  public changeListFormat(value: ListFormat) {}

  getLearningAreaById(areaId: number): Observable<LearningAreaInterface> {
    //TODO should be implemented once the vm is finished
    return of(<LearningAreaInterface>{});
  }

  taskInstancesByLearningArea(
    learningAreaId: number
  ): Observable<TaskInstancesWithEduContentInfoInterface> {
    //TODO should be implemented once the vm is finished
    return of(<TaskInstancesWithEduContentInfoInterface>{});
  }
}

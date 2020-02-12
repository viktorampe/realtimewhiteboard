import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import {
  DalState,
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '@campus/dal';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { KabasTasksResolver } from '../components/kabas-tasks.resolver';
import { getTaskWithAssignmentAndEduContents } from '../components/kabas-tasks.viewmodel.selectors';
import { TaskStatusEnum } from '../interfaces/TaskWithAssignees.interface';

@Injectable()
export class PendingTaskGuard implements CanActivate {
  constructor(
    private store: Store<DalState>,
    private kabasTaskResolver: KabasTasksResolver,
    @Inject('uuid') private uuid: Function
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.kabasTaskResolver.resolve(route).pipe(
      filter(isResolved => isResolved),
      switchMap(() => {
        return this.store.select(getTaskWithAssignmentAndEduContents, {
          taskId: +route.params.id
        });
      }),
      take(1),
      map(task => {
        const isPending = task.status === TaskStatusEnum.PENDING;

        if (!isPending) {
          // Rejected, so give some feedback as to why the page isn't loading
          this.store.dispatch(
            new EffectFeedbackActions.AddEffectFeedback({
              effectFeedback: new EffectFeedback({
                id: this.uuid(),
                triggerAction: null,
                message:
                  'Kan geen inhoud meer toevoegen: taak is al actief of voltooid.',
                type: 'error',
                userActions: [],
                priority: Priority.HIGH
              })
            })
          );
        }

        return isPending;
      })
    );
  }
}

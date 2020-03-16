import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {
  DalState,
  EffectFeedback,
  EffectFeedbackActions,
  Priority,
  TaskStatusEnum
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { KabasTasksResolver } from '../components/kabas-tasks.resolver';
import { getTaskWithAssignmentAndEduContents } from '../components/kabas-tasks.viewmodel.selectors';

@Injectable()
export class PendingTaskGuard implements CanActivate {
  constructor(
    private store: Store<DalState>,
    private router: Router,
    private kabasTaskResolver: KabasTasksResolver,
    @Inject('uuid') private uuid: Function
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.kabasTaskResolver.resolve(route).pipe(
      switchMap(() => {
        return this.store.pipe(
          select(getTaskWithAssignmentAndEduContents, {
            taskId: +route.params.id
          })
        );
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
          return this.router.createUrlTree(['/tasks', 'manage', task.id]);
        }

        return isPending;
      })
    );
  }
}

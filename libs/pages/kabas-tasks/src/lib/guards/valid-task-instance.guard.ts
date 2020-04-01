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
  TaskInstanceQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { StudentTaskOverviewResolver } from '../components/student-task-overview/student-task-overview.resolver';

@Injectable()
export class ValidTaskInstanceGuard implements CanActivate {
  constructor(
    private store: Store<DalState>,
    private router: Router,
    private studentTaskOverviewResolver: StudentTaskOverviewResolver,
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
    return this.studentTaskOverviewResolver.resolve(route).pipe(
      switchMap(() => {
        return this.store.pipe(
          select(TaskInstanceQueries.getById, { id: +route.params.id })
        );
      }),
      take(1),
      map(taskInstance => {
        const canVisit = !!taskInstance;

        if (!canVisit) {
          // Rejected, so give some feedback as to why the page isn't loading
          this.store.dispatch(
            new EffectFeedbackActions.AddEffectFeedback({
              effectFeedback: new EffectFeedback({
                id: this.uuid(),
                triggerAction: null,
                message: 'De taak bestaat niet of is niet aan jou toegekend.',
                type: 'error',
                userActions: [],
                priority: Priority.HIGH
              })
            })
          );
          return this.router.createUrlTree(['/tasks']);
        }

        return canVisit;
      })
    );
  }
}

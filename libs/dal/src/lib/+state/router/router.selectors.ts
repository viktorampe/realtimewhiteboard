import * as fromRouter from '@ngrx/router-store';
import { RouterReducerState } from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import { RouterStateUrl } from './route-serializer';

export interface State {
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  routerReducer: fromRouter.routerReducer
};

export const getRouterState = createFeatureSelector<
  RouterReducerState<RouterStateUrl>
>('router');

export const getRouterStateParams = createSelector(
  getRouterState,
  (router): any => {
    return router.state.params;
  }
);

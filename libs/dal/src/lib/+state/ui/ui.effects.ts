import { Inject, Injectable } from '@angular/core';
import {
  BROWSER_STORAGE_SERVICE_TOKEN,
  StorageServiceInterface
} from '@campus/browser';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { DataPersistence } from '@nrwl/angular';
import { filter, map } from 'rxjs/operators';
import { DalState } from '..';
import { ActionSuccessful } from '../dal.actions';
import { RouterStateUrl } from '../router/route-serializer';
import {
  LoadUi,
  SaveUi,
  SetBreadcrumbs,
  UiActionTypes,
  UiLoaded
} from './ui.actions';

@Injectable()
export class UiEffects {
  @Effect()
  loadUi$ = this.dataPersistence.fetch(UiActionTypes.LoadUi, {
    run: (action: LoadUi, state: DalState) => {
      let data;
      try {
        data = this.storageService.get('ui');
        data = JSON.parse(data);
      } catch (error) {
        //just return the initial state on error
        return new UiLoaded({ state: { ...state.ui, loaded: true } });
      }
      return new UiLoaded({ state: { ...data, loaded: true } });
    }
  });

  @Effect()
  localStorage$ = this.actions$.pipe(
    filter(action => {
      const excludes = [
        UiActionTypes.LoadUi,
        UiActionTypes.UiLoaded,
        UiActionTypes.SaveUi
      ];
      // exclude actions that shoiuld not trigger UI persist
      // like eg saveUI to avoid endless loop
      // or loadUI which would save an empty state
      return excludes.indexOf(<UiActionTypes>action.type) === -1;
    }),
    ofType(
      ...Object.keys(UiActionTypes).map(actionType => UiActionTypes[actionType])
    ),
    map(() => new SaveUi())
  );

  @Effect()
  saveUi$ = this.dataPersistence.fetch(UiActionTypes.SaveUi, {
    run: (action: SaveUi, state: DalState) => {
      try {
        this.storageService.set('ui', JSON.stringify(state.ui));
      } catch (error) {
        // we don't want errors on failing localstorage, because it's not breaking
      }
    }
  });

  @Effect()
  breadcrumbs$ = this.dataPersistence.fetch(ROUTER_NAVIGATION, {
    run: (action: RouterNavigationAction, state: DalState) => {
      const routerState = <RouterStateUrl>(<unknown>action.payload.routerState);
      // routerState contains every 'hop' of the routermodule
      // filtering empty hops
      // building url substrings per hop
      const filteredRoutes = routerState.routeParts.reduce(
        (acc, routePart) => {
          // filter
          if (routePart.url) {
            acc.push({
              ...routePart,
              // build url path
              urlParts: [
                ...(acc[acc.length - 1] ? acc[acc.length - 1].urlParts : []),
                routePart.url
              ]
            });
          }
          return acc;
        },
        [] as RouterStateUrl[]
      );

      const breadcrumbs = filteredRoutes.map(routePart => {
        const { selector, displayProperty, breadcrumbText } = routePart.data;

        // in an effect, so selectors are synchronous
        const displayText = selector
          ? displayProperty
            ? selector(state, { id: routePart.url })[displayProperty]
            : selector(state, { id: routePart.url })
          : breadcrumbText;

        return { displayText, link: routePart.urlParts };
      });

      return new SetBreadcrumbs({ breadcrumbs });
    },
    onError: () => {
      console.error('loading breadcrumbs failed');
      return new ActionSuccessful({
        successfulAction: 'breadcrumbs failed successfully'
      });
    }
  });

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(BROWSER_STORAGE_SERVICE_TOKEN)
    private storageService: StorageServiceInterface
  ) {}
}

import { Inject, Injectable } from '@angular/core';
import {
  BROWSER_STORAGE_SERVICE_TOKEN,
  StorageServiceInterface
} from '@campus/browser';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { MemoizedSelectorWithProps } from '@ngrx/store/src/selector';
import { DataPersistence } from '@nrwl/nx';
import { RouterStateUrl } from 'libs/shared/src/lib/services/route-serializer';
import { filter, map } from 'rxjs/operators';
import { UiActions } from '.';
import { DalState } from '..';
import { LoadUi, SaveUi, UiActionTypes, UiLoaded } from './ui.actions';

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
    run: (action, state: DalState) => {
      const routerState = action.payload.routerState;

      // routerState contains every 'hop' of the routermodule
      // filtering empty hops
      // building url substrings per hop
      const filteredRoutes: RouterStateUrl[] = routerState.routeParts.reduce(
        (acc, routePart) => {
          if (routePart.url) {
            acc.push({
              ...routePart,
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

      // turns array with observables into observable of array
      const breadcrumbs = filteredRoutes.map(routePart => {
        const {
          selector,
          property: displayedProp,
          breadcrumb: breadcrumbText
        } = routePart.data;

        let displayText: string;
        if (selector) {
          const syncSelector = <MemoizedSelectorWithProps<DalState, any, any>>(
            selector
          );
          const entity = syncSelector(state, { id: routePart.url });

          displayText = entity[displayedProp];
        } else {
          displayText = breadcrumbText;
        }
        return { displayText, link: routePart.urlParts };
      });

      return new UiActions.SetBreadcrumbs({ breadcrumbs });
    }
  });

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(BROWSER_STORAGE_SERVICE_TOKEN)
    private storageService: StorageServiceInterface
  ) {}
}

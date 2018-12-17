import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { DalState } from '@campus/dal';
import { BreadcrumbLinkInterface } from '@campus/ui';
import { MemoizedSelector, select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterStateUrl } from './breadcrumbs.service';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {
  currentRoute$ = new BehaviorSubject<RouterStateUrl>(null);
  breadcrumbs$: Observable<BreadcrumbLinkInterface[]> = of([]);

  constructor(private store: Store<DalState>) {
    // this.breadcrumbs$ = this.currentRoute$.pipe(
    //   flatMap(routerState => this.getBreadcrumbs(routerState))
    // );
  }

  public getBreadcrumbs(
    routerState: RouterStateUrl
  ): Observable<BreadcrumbLinkInterface[]> {
    // routerState contains every 'hop' of the routermodule
    // filtering empty hops
    // building url substrings per hop
    const filteredRoutes = routerState.routeParts.reduce(
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
    return combineLatest(
      filteredRoutes.map(routePart => {
        const {
          selector,
          property: displayedProp,
          breadcrumb: breadcrumbText
        } = routePart.data as BreadcrumbRouteDataInterface;

        if (selector) {
          return this.store.pipe(
            select(selector, {
              id: routePart.url
            }),
            map(entity => ({
              displayText: entity[displayedProp],
              link: routePart.urlParts
            }))
          );
        } else {
          return of({
            displayText: breadcrumbText,
            link: routePart.urlParts
          });
        }
      })
    );
  }
}

export interface BreadcrumbRouteDataInterface {
  breadcrumb?: string;
  selector?: MemoizedSelector<DalState, any>;
  property?: string;
}

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams?: Params;
  data?: BreadcrumbRouteDataInterface;
  routeParts?: RouterStateUrl[];
  urlParts?: string[];
}

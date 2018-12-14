import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { DalState } from '@campus/dal';
import { BreadcrumbLinkInterface } from '@campus/ui';
import { MemoizedSelector, select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  flatMap,
  map,
  startWith
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {
  private currentRoute$: Observable<ActivatedRouteSnapshot>;
  breadcrumbs$: Observable<BreadcrumbLinkInterface[]>;

  constructor(private router: Router, private store: Store<DalState>) {
    this.setCurrentRoute();
  }

  public setCurrentRoute() {
    this.currentRoute$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd), // still triggers twice for some reason
      distinctUntilChanged(), // we are not interested if the route doesn't change
      startWith({}),
      map(_ => this.router.routerState.snapshot.root)
    );

    this.breadcrumbs$ = this.currentRoute$.pipe(
      flatMap(route => this.getBreadcrumbs(route))
    );
  }

  private getBreadcrumbs(
    route: ActivatedRouteSnapshot
  ): Observable<BreadcrumbLinkInterface[]> {
    let currentRoute = route;
    const routes = [];

    do {
      routes.push({
        url: currentRoute.url[0] ? currentRoute.url[0].path : '',
        params: currentRoute.params,
        data: currentRoute.data
      });
      currentRoute = currentRoute.firstChild;
    } while (currentRoute);

    // routes contains every 'hop' of the routermodule
    const filteredRoutes = routes.filter(routePart => routePart.url.length);

    let breadcrumbs: Observable<BreadcrumbLinkInterface[]>;
    const urlParts = [];

    breadcrumbs = combineLatest(
      filteredRoutes.map(routePart => {
        urlParts.push(routePart.url);

        const data = routePart.data as BreadcrumbRouteDataInterface;
        const selector = data.selector;
        const displayedProp = data.property;
        const breadcrumbText = data.breadcrumb;

        if (selector) {
          return this.store.pipe(
            select(selector, {
              id: routePart.url
            }),
            map(entity => ({
              displayText: entity[displayedProp],
              link: urlParts
            }))
          );
        } else {
          return of({
            displayText: breadcrumbText,
            link: urlParts
          });
        }
      })
    );

    console.log(urlParts);
    return breadcrumbs;
  }
}

export interface BreadcrumbRouteDataInterface {
  breadcrumb?: string;
  selector?: MemoizedSelector<DalState, any>;
  property?: string;
}

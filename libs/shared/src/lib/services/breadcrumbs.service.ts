import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router
} from '@angular/router';
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
  private currentRoute$: Observable<ActivatedRoute>;
  breadcrumbs$: Observable<BreadcrumbLinkInterface[]> = of([]);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<DalState>
  ) {
    this.setCurrentRoute();
  }

  public setCurrentRoute() {
    this.currentRoute$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
      startWith({}),
      map(_ => this.activatedRoute)
    );

    this.breadcrumbs$ = this.currentRoute$.pipe(
      // flatMap(route => this.getBreadcrumbs(route.snapshot.root))
      flatMap(route => this.getBreadcrumbsObservable(route.root))
    );
  }

  private getBreadcrumbsObservable(
    route: ActivatedRoute
  ): Observable<BreadcrumbLinkInterface[]> {
    const routes: ActivatedRoute[] = [];
    let currentRoute = route;

    do {
      routes.push(currentRoute);
      currentRoute = currentRoute.firstChild;
    } while (currentRoute);

    let breadcrumbs: Observable<BreadcrumbLinkInterface[]>;
    const url = [];

    breadcrumbs = combineLatest(
      routes.map(activatedRoute =>
        combineLatest(
          activatedRoute.url,
          activatedRoute.data,
          activatedRoute.params
        ).pipe(
          flatMap(([routeUrl, routeData, routeParams]) => {
            if (routeUrl && routeUrl.length) {
              url.push(routeUrl[0].path);

              const data = routeData as BreadcrumbRouteDataInterface;

              let paramProperty;
              let routeParam;

              if (activatedRoute.routeConfig) {
                paramProperty = activatedRoute.routeConfig.path.substr(1);
                routeParam = routeParams[paramProperty];
              }

              const selector = data.selector;
              const displayedProp = data.property;
              const breadcrumbText = data.breadcrumb;

              if (selector) {
                return this.store.pipe(
                  select(selector, {
                    id: routeParam
                  }),
                  map(entity => ({
                    displayText: entity[displayedProp],
                    link: url
                  }))
                );
              } else {
                return of({
                  displayText: breadcrumbText,
                  link: url
                });
              }
            } else return of({ displayText: 'leeg', link: [] });
          })
        )
      )
    );

    return breadcrumbs;
  }

  private getBreadcrumbs(
    route: ActivatedRouteSnapshot
  ): Observable<BreadcrumbLinkInterface[]> {
    const routes: ActivatedRouteSnapshot[] = [];
    let currentRoute = route;

    do {
      routes.push(currentRoute);
      currentRoute = currentRoute.firstChild;
    } while (currentRoute);

    let breadcrumbs: Observable<BreadcrumbLinkInterface[]>;
    const url = [];

    breadcrumbs = combineLatest(
      routes
        .filter(routePart => routePart.url && routePart.url.length)
        .map(routePart => {
          url.push(routePart.url[0].path);

          const data = routePart.data as BreadcrumbRouteDataInterface;

          const paramProperty = routePart.routeConfig.path.substr(1);
          const routeParam = routePart.params[paramProperty];
          const selector = data.selector;
          const displayedProp = data.property;
          const breadcrumbText = data.breadcrumb;

          if (selector) {
            return this.store.pipe(
              select(selector, {
                id: routeParam
              }),
              map(entity => ({
                displayText: entity[displayedProp],
                link: url
              }))
            );
          } else {
            return of({
              displayText: breadcrumbText,
              link: url
            });
          }
        })
    );

    return breadcrumbs;
  }
}

export interface BreadcrumbRouteDataInterface {
  breadcrumb?: string;
  selector?: MemoizedSelector<DalState, any>;
  property?: string;
}

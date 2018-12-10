import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router
} from '@angular/router';
import { DalState } from '@campus/dal';
import { BreadcrumbLinkInterface } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {
  private currentRoute$: Observable<ActivatedRouteSnapshot>;
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
      startWith({}),
      map(_ => this.activatedRoute.snapshot)
    );

    this.breadcrumbs$ = this.currentRoute$.pipe(
      map(route => this.getBreadcrumbs(route))
    );
  }

  private getBreadcrumbs(route: ActivatedRouteSnapshot) {
    const breadcrumbs: BreadcrumbLinkInterface[] = [];
    let url = [];

    do {
      if (route.url && route.url.length) {
        url = [...url, route.url[0].path];

        const routeParam = route.params[route.routeConfig.path.substr(1)];
        const displayedProp = route.data['property'];
        const selector = route.data['selector'];
        const breadcrumbText = route.data['breadcrumb'];

        breadcrumbs.push({
          displayText: selector
            ? this.store.pipe(
                select(selector, {
                  id: routeParam
                }),
                map(data => data[displayedProp])
              )
            : of(breadcrumbText),
          link: url
        });
      }

      route = route.firstChild;
    } while (route);

    return breadcrumbs;
  }
}

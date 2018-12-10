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
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {
  private currentRoute$: Observable<ActivatedRouteSnapshot>;
  breadcrumbs$: Observable<BreadcrumbLinkInterface[]>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<DalState>
  ) {}

  public setCurrentRoute() {
    this.currentRoute$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(_ => this.activatedRoute.snapshot)
    );

    this.currentRoute$.subscribe(route => this.getCurrentRoute(route));
  }

  private getCurrentRoute(route: ActivatedRouteSnapshot) {
    const breadcrumbs: BreadcrumbLinkInterface[] = [];

    console.log('------------------------------');
    do {
      if (route.url && route.url.length) {
        // console.log('raw', route);
        console.log('urlsegment', route.url[0]);
        console.log('route', route.data['breadcrumb']);
        console.log('selector', route.data['selector']);
        console.log('routeconfig', route.routeConfig.path);
        console.log('id', route.params[route.routeConfig.path.substr(1)]);
        console.log('------------------------------');

        breadcrumbs.push({
          displayText: route.data['selector']
            ? this.store.pipe(
                select(
                  route.data['selector'],
                  route.params[route.routeConfig.path.substr(1)]
                )
              )
            : route.data['breadcrumb'],
          link: route.url
        });
      }

      route = route.firstChild;
    } while (route);

    console.log(breadcrumbs);
  }
}

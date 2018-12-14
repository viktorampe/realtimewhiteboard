import { Params, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';
import { BreadcrumbRouteDataInterface } from './breadcrumbs.service';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams?: Params;
  data?: BreadcrumbRouteDataInterface;
  routeParts?: RouterStateUrl[];
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot) {
    let currentRoute = routerState.root;
    const routes = [];
    const {
      url,
      root: { queryParams }
    } = routerState;

    do {
      routes.push({
        url: currentRoute.url[0] ? currentRoute.url[0].path : '',
        params: currentRoute.params,
        data: currentRoute.data
      });
      currentRoute = currentRoute.firstChild;
    } while (currentRoute);

    return {
      url,
      params: routes[routes.length - 1].params,
      queryParams,
      routeParts: routes
    };
  }
}

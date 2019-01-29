import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class RedirectionGuard implements CanActivate {
  constructor() {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // go through the segments of the url in the route if we find something starting with http
    // we assume it's an external url
    // from there we assemble the url adding slashes where needed.
    let path = '';
    route.url.map(item => {
      if (!path) {
        if (item.path.toLowerCase().includes('http')) {
          path = item.path + '//';
        }
      } else {
        path += item.path + '/';
      }
    });
    if (path) {
      // path should be an external url so we open it in a new tab.
      window.open(path, '_blank');
      // we found an external link so our app shouldnt move page
      return false;
    }

    //TODO no external link or path found do we want to redirect somewhere usefull ?
    return true;
  }
}

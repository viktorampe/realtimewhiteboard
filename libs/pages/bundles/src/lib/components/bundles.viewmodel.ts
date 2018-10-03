import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { LoadUser, userQuery, UserState } from '@campus/dal';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BundlesViewModel implements Resolve<boolean> {
  userLoaded: Observable<any>;

  constructor(private store: Store<UserState>) {
    this.userLoaded = store.select(userQuery.getLoaded);
  }

  resolve(): Observable<boolean> {
    // TODO update
    this.store.dispatch(new LoadUser());
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }
}

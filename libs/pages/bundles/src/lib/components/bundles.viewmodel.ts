import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BundlesViewModel implements Resolve<boolean> {
  constructor() {}

  resolve(): Observable<boolean> {
    // TODO update
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }
}

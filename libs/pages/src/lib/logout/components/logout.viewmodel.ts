import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LogoutViewModel {
  constructor() {}

  initialize(): Observable<boolean> {
    // TODO update
    return new BehaviorSubject<boolean>(true);
  }
}

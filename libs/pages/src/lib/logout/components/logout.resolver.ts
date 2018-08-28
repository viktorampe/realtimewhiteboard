import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { LogoutViewModel } from './logout.viewmodel';

@Injectable()
export class LogoutResolver implements Resolve<boolean> {
  constructor(private logoutViewModel: LogoutViewModel) {}

  resolve(): Observable<boolean> {
    return this.logoutViewModel.initialize().pipe(take(1));
  }
}

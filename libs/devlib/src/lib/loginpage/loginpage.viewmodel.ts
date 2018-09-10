import { Inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AuthServiceInterface, AuthServiceToken } from '@campus/dal';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginPageViewModel implements Resolve<boolean> {
  name: string;
  password: string;
  response: string;

  constructor(
    @Inject(AuthServiceToken) private authService: AuthServiceInterface
  ) {}

  login(name: string, password: string) {
    this.authService.login({ username: name, password: password });
  }

  /**
   * initializes the LoginPageViewModel
   *
   * @returns {boolean} not used, returning boolean so the resolver will work
   *
   * @memberOf LoginPageViewModel
   */
  resolve(): Observable<boolean> {
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }
}

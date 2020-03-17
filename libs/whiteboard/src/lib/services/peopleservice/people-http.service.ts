import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, retry, switchMap, take } from 'rxjs/operators';
import { UserInterface } from '../../models/User.interface';

const RETRY_AMOUNT = 2;

export interface PeopleHttpServiceInterface {
  getJson(userId: string): Observable<UserInterface>;
}

@Injectable({
  providedIn: 'root'
})
export class PeopleHttpService implements PeopleHttpServiceInterface {
  private apiSettings$ = new BehaviorSubject<PeopleHttpServiceInterface>(null);
  private _errors$ = new Subject<Error>();

  constructor(private http: HttpClient) {}

  getJson(userId: string): Observable<UserInterface> {
    const response$ = this.apiSettings$.pipe(
      filter(settings => !!settings),
      take(1),
      switchMap(() =>
        this.http.get(`api/People/${userId}/data?fields=permissions`, {
          withCredentials: true
        })
      ),
      retry(RETRY_AMOUNT),
      catchError(this.handleError.bind(this))
    );

    return response$;
  }

  private handleError(error: Error) {
    this._errors$.next(error);

    return throwError(error);
  }
}

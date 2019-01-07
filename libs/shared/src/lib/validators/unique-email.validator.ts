import { Inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors
} from '@angular/forms';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  PersonServiceInterface,
  PERSON_SERVICE_TOKEN
} from '@campus/dal';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UniqueEmailValidator implements AsyncValidator {
  constructor(
    @Inject(PERSON_SERVICE_TOKEN) private personService: PersonServiceInterface,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {}

  validate(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    return this.personService
      .checkUniqueEmail(this.authService.userId, ctrl.value)
      .pipe(
        map(isUnique => {
          return isUnique ? null : { notUniqueEmail: true };
        }),
        catchError(() => of({ serverError: true }))
      );
  }
}

import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors
} from '@angular/forms';
import { AuthServiceInterface, PersonServiceInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UniqueEmailValidator implements AsyncValidator {
  constructor(
    private personService: PersonServiceInterface,
    private authService: AuthServiceInterface
  ) {}

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    // return of null means there is no error, so the email is unique
    // return of true means there is an error, so the email is not unique
    return this.personService
      .checkUniqueEmail(this.authService.userId, ctrl.value)
      .pipe(
        map(isTaken => (isTaken ? { uniqueEmail: true } : null)),
        catchError(() => null)
      );
  }
}

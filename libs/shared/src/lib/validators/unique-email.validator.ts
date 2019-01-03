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
    return this.personService
      .checkUniqueEmail(this.authService.userId, ctrl.value)
      .pipe(
        map(isUnique => {
          return isUnique ? null : { uniqueEmail: true };
        }),
        catchError(() => null)
      );
  }
}

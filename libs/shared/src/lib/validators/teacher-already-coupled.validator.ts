import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors
} from '@angular/forms';
import { DalState, LinkedPersonQueries, PersonQueries } from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TeacherAlreadyCoupledValidator implements AsyncValidator {
  constructor(private store: Store<DalState>) {}

  validate(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    return this.store.pipe(
      select(LinkedPersonQueries.getLinkedPersonIds),
      switchMap(linkedPersonIds =>
        this.store.pipe(
          select(PersonQueries.getByIds, { ids: linkedPersonIds })
        )
      ),
      map(linkedPersons => {
        return linkedPersons.some(
          linkedPerson => linkedPerson.teacherInfo.publicKey === ctrl.value
        )
          ? { teacherAlreadyCoupled: true }
          : null;
      }),
      tap(teacherAlreadyCoupledError => {
        console.log(
          '%cteacherAlreadyCoupledError',
          'color: orange; font-weight: bold;'
        );
        console.log({ teacherAlreadyCoupledError });
      })
    );
  }
}

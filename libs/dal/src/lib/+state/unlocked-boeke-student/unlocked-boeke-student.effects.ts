import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  UnlockedBoekeStudentServiceInterface,
  UNLOCKED_BOEKE_STUDENT_SERVICE_TOKEN
} from '../../boeke/unlocked-boeke-student.service.interface';
import {
  LoadUnlockedBoekeStudents,
  UnlockedBoekeStudentsActionTypes,
  UnlockedBoekeStudentsLoaded,
  UnlockedBoekeStudentsLoadError
} from './unlocked-boeke-student.actions';
import { State } from './unlocked-boeke-student.reducer';

@Injectable()
export class UnlockedBoekeStudentsEffects {
  @Effect()
  loadUnlockedBoekeStudents$ = this.dataPersistence.fetch(
    UnlockedBoekeStudentsActionTypes.LoadUnlockedBoekeStudents,
    {
      run: (action: LoadUnlockedBoekeStudents, state: any) => {
        if (!action.payload.force && state.unlockedBoekeStudents.loaded) return;
        return this.unlockedBoekeStudentService
          .getAllForUser(action.payload.userId)
          .pipe(
            map(
              unlockedBoekeStudents =>
                new UnlockedBoekeStudentsLoaded({ unlockedBoekeStudents })
            )
          );
      },
      onError: (action: LoadUnlockedBoekeStudents, error) => {
        return new UnlockedBoekeStudentsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<State>,
    @Inject(UNLOCKED_BOEKE_STUDENT_SERVICE_TOKEN)
    private unlockedBoekeStudentService: UnlockedBoekeStudentServiceInterface
  ) {}
}

import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
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

@Injectable()
export class UnlockedBoekeStudentsEffects {
  @Effect()
  loadUnlockedBoekeStudents$ = this.dataPersistence.fetch(
    UnlockedBoekeStudentsActionTypes.LoadUnlockedBoekeStudents,
    {
      run: (action: LoadUnlockedBoekeStudents, state: DalState) => {
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
    private dataPersistence: DataPersistence<DalState>,
    @Inject(UNLOCKED_BOEKE_STUDENT_SERVICE_TOKEN)
    private unlockedBoekeStudentService: UnlockedBoekeStudentServiceInterface
  ) {}
}

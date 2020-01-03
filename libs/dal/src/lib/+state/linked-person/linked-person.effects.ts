import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  LinkedPersonServiceInterface,
  LINKED_PERSON_SERVICE_TOKEN
} from '../../persons/linked-persons.service';
import {
  LinkedPersonsActionTypes,
  LinkedPersonsLoaded,
  LinkedPersonsLoadError,
  LoadLinkedPersons
} from './linked-person.actions';

@Injectable()
export class LinkedPersonEffects {
  @Effect()
  loadLinkedPersons$ = this.dataPersistence.fetch(
    LinkedPersonsActionTypes.LoadLinkedPersons,
    {
      run: (action: LoadLinkedPersons, state: DalState) => {
        if (!action.payload.force && state.linkedPersons.loaded) return;
        return this.linkedPersonService
          .getAllForUser(action.payload.userId)
          .pipe(map(persons => new LinkedPersonsLoaded({ persons })));
      },
      onError: (action: LoadLinkedPersons, error) => {
        return new LinkedPersonsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(LINKED_PERSON_SERVICE_TOKEN)
    private linkedPersonService: LinkedPersonServiceInterface
  ) {}
}

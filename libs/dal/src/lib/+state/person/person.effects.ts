import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  PersonServiceInterface,
  PERSON_SERVICE_TOKEN
} from '../../persons/persons.service';
import {
  LoadPersons,
  PersonsActionTypes,
  PersonsLoaded,
  PersonsLoadError
} from './person.actions';

@Injectable()
export class PersonEffects {
  @Effect()
  loadPersons$ = this.dataPersistence.fetch(PersonsActionTypes.LoadPersons, {
    run: (action: LoadPersons, state: DalState) => {
      if (!action.payload.force && state.persons.loaded) return;
      return this.personService
        .getAllForUser(action.payload.userId)
        .pipe(map(persons => new PersonsLoaded({ persons })));
    },
    onError: (action: LoadPersons, error) => {
      return new PersonsLoadError(error);
    }
  });

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(PERSON_SERVICE_TOKEN) private personService: PersonServiceInterface
  ) {}
}

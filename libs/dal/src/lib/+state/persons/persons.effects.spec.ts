import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { NxModule } from '@nrwl/nx';
import { DataPersistence } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';

import { PersonsEffects } from './persons.effects';
import { LoadPersons, PersonsLoaded } from './persons.actions';

describe('PersonsEffects', () => {
  let actions: Observable<any>;
  let effects: PersonsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        PersonsEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(PersonsEffects);
  });

  describe('loadPersons$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: new LoadPersons() });
      expect(effects.loadPersons$).toBeObservable(
        hot('-a-|', { a: new PersonsLoaded([]) })
      );
    });
  });
});

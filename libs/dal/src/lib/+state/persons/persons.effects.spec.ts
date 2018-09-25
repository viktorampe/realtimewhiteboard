import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { LoadPersons, PersonsLoaded } from './persons.actions';
import { PersonsEffects } from './persons.effects';

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

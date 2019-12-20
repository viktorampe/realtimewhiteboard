import { TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import {
  DalState,
  getStoreModuleForFeatures,
  LinkedPersonActions,
  LinkedPersonReducer,
  PersonFixture
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/angular/testing';
import { PersonAlreadyLinkedValidator } from './person-already-linked.validator';

describe('PersonAlreadyLinkedValidator', () => {
  let personAlreadyLinkedValidator: PersonAlreadyLinkedValidator;
  let store: Store<DalState>;
  const control: AbstractControl = { value: 'foo' } as AbstractControl;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([LinkedPersonReducer])
      ],
      providers: [PersonAlreadyLinkedValidator]
    });
    store = TestBed.get(Store);
    personAlreadyLinkedValidator = TestBed.get(PersonAlreadyLinkedValidator);
  });

  it('should return null with an initialState of no linked persons', () => {
    expect(personAlreadyLinkedValidator.validate(control)).toBeObservable(
      hot('(a|)', { a: null })
    );
  });

  it('should return null if linked person has no teacherInfo', () => {
    store.dispatch(
      new LinkedPersonActions.LinkedPersonsLoaded({
        persons: [new PersonFixture()]
      })
    );
    expect(personAlreadyLinkedValidator.validate(control)).toBeObservable(
      hot('(a|)', { a: null })
    );
  });

  it('should return null if the provided value is not in one of the linked person publicKeys', () => {
    store.dispatch(
      new LinkedPersonActions.LinkedPersonsLoaded({
        persons: [new PersonFixture({ teacherInfo: { publicKey: 'not-foo' } })]
      })
    );
    expect(personAlreadyLinkedValidator.validate(control)).toBeObservable(
      hot('(a|)', { a: null })
    );
  });

  it('should return a validation error if the there is a person with a corresponding publicKey', () => {
    store.dispatch(
      new LinkedPersonActions.LinkedPersonsLoaded({
        persons: [new PersonFixture({ teacherInfo: { publicKey: 'foo' } })]
      })
    );
    expect(personAlreadyLinkedValidator.validate(control)).toBeObservable(
      hot('(a|)', { a: { teacherAlreadyCoupled: true } })
    );
  });
});

import { TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { AUTH_SERVICE_TOKEN, PERSON_SERVICE_TOKEN } from '@campus/dal';
import { hot } from '@nrwl/angular/testing';
import { Observable } from 'rxjs';
import { UniqueUsernameValidator } from './unique-username.validator';

describe('Unique username async validator', () => {
  let uniqueUsernameValidator: UniqueUsernameValidator;
  let mockResponse$: Observable<boolean>;
  const control: AbstractControl = { value: 'foo' } as AbstractControl;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UniqueUsernameValidator,
        {
          provide: PERSON_SERVICE_TOKEN,
          useValue: { checkUniqueUsername: () => mockResponse$ }
        },
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } }
      ]
    });

    uniqueUsernameValidator = TestBed.get(UniqueUsernameValidator);
  });

  it('should return null of the username is unique', () => {
    mockResponse$ = hot('-a-|', { a: true });
    expect(uniqueUsernameValidator.validate(control)).toBeObservable(
      hot('-a-|', { a: null })
    );
  });

  it('should return a validation error if the username is not unique', () => {
    mockResponse$ = hot('-a-|', { a: false });
    expect(uniqueUsernameValidator.validate(control)).toBeObservable(
      hot('-a-|', { a: { notUniqueUsername: true } })
    );
  });

  it('should return a validation error if the API call went wrong', () => {
    mockResponse$ = hot('-#|', 'something went wrong');

    expect(uniqueUsernameValidator.validate(control)).toBeObservable(
      hot('-(x|)', { x: { serverError: true } })
    );
  });
});

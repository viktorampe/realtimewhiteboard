import { TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { AUTH_SERVICE_TOKEN, PERSON_SERVICE_TOKEN } from '@campus/dal';
import { hot } from '@nrwl/angular/testing';
import { Observable } from 'rxjs';
import { UniqueEmailValidator } from './unique-email.validator';

describe('Unique email async validator', () => {
  let uniqueEmailValidator: UniqueEmailValidator;
  let mockResponse$: Observable<boolean>;
  const control: AbstractControl = { value: 'foo' } as AbstractControl;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UniqueEmailValidator,
        {
          provide: PERSON_SERVICE_TOKEN,
          useValue: { checkUniqueEmail: () => mockResponse$ }
        },
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } }
      ]
    });

    uniqueEmailValidator = TestBed.get(UniqueEmailValidator);
  });

  it('should return null of the email is unique', () => {
    mockResponse$ = hot('-a-|', { a: true });

    expect(uniqueEmailValidator.validate(control)).toBeObservable(
      hot('-a-|', { a: null })
    );
  });

  it('should return a validation error if the email is not unique', () => {
    mockResponse$ = hot('-a-|', { a: false });

    expect(uniqueEmailValidator.validate(control)).toBeObservable(
      hot('-a-|', { a: { notUniqueEmail: true } })
    );
  });

  it('should return a validation error if the API call went wrong', () => {
    mockResponse$ = hot('-#|', 'something went wrong');

    expect(uniqueEmailValidator.validate(control)).toBeObservable(
      hot('-(x|)', { x: { serverError: true } })
    );
  });
});

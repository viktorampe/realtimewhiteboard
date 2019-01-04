import { AbstractControl } from '@angular/forms';
import { AuthServiceInterface, PersonServiceInterface } from '@campus/dal';
import { of, throwError } from 'rxjs';
import { UniqueEmailValidator } from './unique-email.validator';

describe('Unique email async validator', () => {
  let uniqueEmailValidator: UniqueEmailValidator;
  const control: AbstractControl = { value: 'foo' } as AbstractControl;

  it('should return null of the email is unique', (done: DoneFn) => {
    setupValidator(true);
    uniqueEmailValidator.validate(control).subscribe(value => {
      expect(value).toBe(null);
      done();
    });
  });

  it('should return a validation error if the email is not unique', (done: DoneFn) => {
    setupValidator(false);
    uniqueEmailValidator.validate(control).subscribe(value => {
      expect(value).toEqual({ notUniqueEmail: true });
      done();
    });
  });

  it('should return a validation error if the API call went wrong', (done: DoneFn) => {
    setupValidator(false, true);
    uniqueEmailValidator.validate(control).subscribe(value => {
      expect(value).toEqual({ serverError: true });
      done();
    });
  });

  function setupValidator(isUnique: boolean, error?: boolean) {
    uniqueEmailValidator = new UniqueEmailValidator(
      {
        checkUniqueEmail: () => {
          return error ? throwError('something went wrong') : of(isUnique);
        },
        getAllForUser: null,
        checkUniqueUsername: null
      } as PersonServiceInterface,
      { userId: 1 } as AuthServiceInterface
    );
  }
});

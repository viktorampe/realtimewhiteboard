import { AbstractControl } from '@angular/forms';
import { AuthServiceInterface, PersonServiceInterface } from '@campus/dal';
import { of } from 'rxjs';
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
      expect(value).toEqual({ uniqueEmail: true });
      done();
    });
  });

  function setupValidator(isUnique: boolean) {
    uniqueEmailValidator = new UniqueEmailValidator(
      {
        checkUniqueEmail: () => of(isUnique),
        getAllForUser: null,
        checkUniqueUsername: null
      } as PersonServiceInterface,
      { userId: 1 } as AuthServiceInterface
    );
  }
});

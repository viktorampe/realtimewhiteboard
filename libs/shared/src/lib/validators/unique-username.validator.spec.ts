import { AbstractControl } from '@angular/forms';
import { AuthServiceInterface, PersonServiceInterface } from '@campus/dal';
import { of } from 'rxjs';
import { UniqueUsernameValidator } from './unique-username.validator';

describe('Unique username async validator', () => {
  let uniqueUsernameValidator: UniqueUsernameValidator;
  const control: AbstractControl = { value: 'foo' } as AbstractControl;

  it('should return null of the username is unique', (done: DoneFn) => {
    setupValidator(true);
    uniqueUsernameValidator.validate(control).subscribe(value => {
      expect(value).toBe(null);
      done();
    });
  });

  it('should return a validation error if the username is not unique', (done: DoneFn) => {
    setupValidator(false);
    uniqueUsernameValidator.validate(control).subscribe(value => {
      expect(value).toEqual({ uniqueUsername: true });
      done();
    });
  });

  function setupValidator(isUnique: boolean) {
    uniqueUsernameValidator = new UniqueUsernameValidator(
      {
        checkUniqueEmail: null,
        getAllForUser: null,
        checkUniqueUsername: () => of(isUnique)
      } as PersonServiceInterface,
      { userId: 1 } as AuthServiceInterface
    );
  }
});

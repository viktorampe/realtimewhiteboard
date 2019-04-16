import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PersonFixture, PersonInterface } from '@campus/dal';
import { UniqueEmailValidator, UniqueUsernameValidator } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { of } from 'rxjs';
import { ProfileFormComponent } from './profile-form.component';

describe('ProfileFormComponent', () => {
  let component: ProfileFormComponent;
  let fixture: ComponentFixture<ProfileFormComponent>;
  let mockData$: ValidationErrors | null;
  const mockFormData = {
    lastName: 'Bar',
    firstName: 'Foo',
    username: 'FooBar',
    email: 'foo.bar@test.com',
    password: 'newPassword',
    verifyPassword: 'newPassword'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        UiModule
      ],
      providers: [
        {
          provide: UniqueEmailValidator,
          useValue: { validate: () => of(mockData$) }
        },
        {
          provide: UniqueUsernameValidator,
          useValue: { validate: () => of(mockData$) }
        }
      ],
      declarations: [ProfileFormComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFormComponent);
    component = fixture.componentInstance;
    component.user = new PersonFixture({
      name: 'Bar',
      firstName: 'Foo',
      username: 'FooBar',
      email: 'foo.bar@test.com',
      password: 'test123'
    });
    fixture.detectChanges();
  });

  describe('setup', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should build the form', () => {
      expect(component.profileForm).toBeDefined();
    });
  });

  describe('profile form', () => {
    it('should be prefilled with the provided user data', () => {
      expect(component.profileForm.value).toEqual({
        lastName: component.user.name,
        firstName: component.user.firstName,
        username: component.user.username,
        email: component.user.email,
        password: '',
        verifyPassword: ''
      });
    });
    describe('form submission', () => {
      it('should emit a partial user', () => {
        // fill in the form
        component.profileForm.setValue(mockFormData);

        // listen for the form output
        let updatedPerson: PersonInterface;
        component.saveProfile.subscribe(value => (updatedPerson = value));

        // submit the form
        component.onSubmit();

        expect(updatedPerson).toEqual({
          name: mockFormData.lastName,
          firstName: mockFormData.firstName,
          username: mockFormData.username,
          email: mockFormData.email,
          password: mockFormData.password
        });
      });

      it('should not include a password property when not filled in', () => {
        const mockFormDataWithoutPassword = {
          ...mockFormData,
          ...{ password: '' }
        };
        // fill in the form
        component.profileForm.setValue(mockFormDataWithoutPassword);

        // listen for the form output
        let updatedPerson: PersonInterface;
        component.saveProfile.subscribe(value => (updatedPerson = value));

        // submit the form
        component.onSubmit();

        expect(updatedPerson).toEqual({
          name: mockFormDataWithoutPassword.lastName,
          firstName: mockFormDataWithoutPassword.firstName,
          username: mockFormDataWithoutPassword.username,
          email: mockFormDataWithoutPassword.email
        });
      });

      it('should reset the form', () => {
        component.profileForm.setValue(mockFormData);
        component.onReset();
        expect(component.profileForm.value).toEqual({
          lastName: component.user.name,
          firstName: component.user.firstName,
          username: component.user.username,
          email: component.user.email,
          password: '',
          verifyPassword: ''
        });
      });
    });

    describe('form validation', () => {
      it('should check lastName field validity', () => {
        setControlValue('lastName', '');
        checkControlValidity('lastName', 'required');
      });

      it('should check firstName field validity', () => {
        setControlValue('firstName', '');
        checkControlValidity('firstName', 'required');
      });

      it('should check email field validity', () => {
        setControlValue('email', '');
        checkControlValidity('email', 'required');
        setControlValue('email', 'notAValidEmail');
        checkControlValidity('email', 'email');

        mockData$ = { notUniqueEmail: true };
        setControlValue('email', 'notUniqueEmail@foobar.com');

        checkControlValidity('email', 'notUniqueEmail');
      });

      it('should check if passwords match', () => {
        setControlValue('password', 'newPassword');
        setControlValue('verifyPassword', 'typo');
        expect(component.profileForm.errors['noPasswordMatch']).toBeTruthy();
      });

      it('should skip checks if no password is filled in', () => {
        setControlValue('password', '');
        expect(component.profileForm.errors).toBeFalsy();
      });
    });
  });

  function setControlValue(control: string, value: string) {
    getControl(control).setValue(value);
  }

  function checkControlValidity(control: string, validator: string) {
    const formControl = component.profileForm.controls[control];
    const errors = formControl.errors;
    expect(errors[validator]).toBeTruthy();
  }

  function getControl(name: string): FormControl {
    return component.profileForm.get(name) as FormControl;
  }
});

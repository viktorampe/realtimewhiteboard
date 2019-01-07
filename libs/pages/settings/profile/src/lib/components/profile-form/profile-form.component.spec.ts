import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PersonFixture } from '@campus/dal';
import { UniqueEmailValidator, UniqueUsernameValidator } from '@campus/shared';
import { of } from 'rxjs';
import { ProfileFormComponent } from './profile-form.component';
// file.only
describe('ProfileFormComponent', () => {
  let component: ProfileFormComponent;
  let fixture: ComponentFixture<ProfileFormComponent>;
  let mockData$: ValidationErrors | null;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule
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
    }).compileComponents();
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

    describe('form validation', () => {
      it('should be valid by default', () => {
        expect(component.profileForm.valid).toBe(true);
      });

      it('should check lastName field validity', () => {
        setControlValue('lastName', '');
        checkControlValidity('lastName', 'required');
      });

      it('should check lastName field validity', () => {
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
        const password = getControl('password');
        password.setValue('newPassword');
        const verifyPassword = getControl('verifyPassword');
        verifyPassword.setValue('typo');
        expect(component.profileForm.errors['noPasswordMatch']).toBeTruthy();
      });

      it('should skip checks if no password is filled in', () => {
        const password = getControl('password');
        password.setValue('');
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { PersonFixture, PersonInterface } from '@campus/dal';

const passwordMatchValidator: ValidatorFn = (
  form: FormGroup
): ValidationErrors | null => {
  const password = form.get('password');
  const verifyPassword = form.get('verifyPassword');

  return password && verifyPassword && password.value !== verifyPassword.value
    ? { noPasswordMatch: true }
    : null;
};

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
  selector: 'campus-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {
  profileForm: FormGroup;
  errorMatcher = new CrossFieldErrorMatcher();

  get lastName(): FormControl {
    return this.profileForm.get('lastName') as FormControl;
  }
  get firstName(): FormControl {
    return this.profileForm.get('firstName') as FormControl;
  }
  get username(): FormControl {
    return this.profileForm.get('username') as FormControl;
  }
  get email(): FormControl {
    return this.profileForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.profileForm.get('password') as FormControl;
  }
  get verifyPassword(): FormControl {
    return this.profileForm.get('verifyPassword') as FormControl;
  }
  @Input() user: PersonInterface;
  @Output() saveProfile = new EventEmitter<PersonInterface>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.user = new PersonFixture({ username: 'FooBar' }); //TODO: remove

    this.buildForm();
  }

  private buildForm() {
    this.profileForm = this.fb.group(
      {
        lastName: [this.user.name, Validators.required],
        firstName: [this.user.firstName, Validators.required],
        username: [this.user.username, Validators.required],
        email: [this.user.email, [Validators.required, Validators.email]],
        password: [''],
        verifyPassword: ['']
      },
      { validators: passwordMatchValidator }
    );
  }

  getControl(name: string): FormControl {
    return this.profileForm.get(name) as FormControl;
  }

  onSubmit() {}

  onReset() {}
}

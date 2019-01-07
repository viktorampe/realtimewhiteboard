import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { PersonFixture, PersonInterface } from '@campus/dal';
import { CrossFieldErrorMatcher } from '@campus/utils';

const passwordMatchValidator: ValidatorFn = (
  form: FormGroup
): ValidationErrors | null => {
  const password = form.get('password');
  const verifyPassword = form.get('verifyPassword');

  return password && verifyPassword && password.value !== verifyPassword.value
    ? { noPasswordMatch: true }
    : null;
};

@Component({
  selector: 'campus-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {
  profileForm: FormGroup;
  errorMatcher = new CrossFieldErrorMatcher();

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

  onSubmit() {
    const updatedProfile: PersonInterface = { ...this.profileForm.value };
    this.saveProfile.next(updatedProfile);
  }

  onReset() {
    this.profileForm.reset();
  }
}

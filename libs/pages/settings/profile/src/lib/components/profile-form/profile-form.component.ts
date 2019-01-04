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

@Component({
  selector: 'campus-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {
  profileForm: FormGroup;

  get password(): FormControl {
    return this.profileForm.get('password') as FormControl;
  }

  @Input() user: PersonInterface;
  @Output() saveProfile = new EventEmitter<PersonInterface>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.user = new PersonFixture({ username: 'FooBar' }); //TODO: remove

    this.buildForm();
  }

  buildForm() {
    this.profileForm = this.fb.group(
      {
        lastName: [this.user.name, Validators.required],
        firstName: [this.user.firstName, Validators.required],
        username: [this.user.username, Validators.required],
        email: [this.user.email, [Validators.required, Validators.email]],
        password: [''],
        repeatPassword: ['']
      },
      { validators: passwordMatchValidator }
    );
  }

  onSubmit() {}

  onReset() {}
}

export const passwordMatchValidator: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const password = control.get('password');
  const repeatPassword = control.get('repeatPassword');

  return password && repeatPassword && password.value !== repeatPassword.value
    ? { noPasswordMatch: true }
    : null;
};

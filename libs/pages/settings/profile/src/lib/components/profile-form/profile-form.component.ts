import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { PersonInterface } from '@campus/dal';
import { UniqueEmailValidator, UniqueUsernameValidator } from '@campus/shared';
import { CrossFieldErrorMatcher } from '@campus/utils';

const passwordMatchValidator: ValidatorFn = (
  form: FormGroup
): ValidationErrors | null => {
  const password = form.get('password');
  const verifyPassword = form.get('verifyPassword');

  if (!password.value) {
    return null;
  }

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

  @Output() saveProfile = new EventEmitter<Partial<PersonInterface>>();

  constructor(
    private fb: FormBuilder,
    private uniqueUsernameValidator: UniqueUsernameValidator,
    private uniqueEmailValidator: UniqueEmailValidator
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.profileForm = this.fb.group(
      {
        lastName: [this.user.name, Validators.required],
        firstName: [this.user.firstName, Validators.required],
        username: [
          this.user.username,
          {
            validators: [Validators.required],
            asyncValidators: [this.uniqueUsernameValidator],
            updateOn: 'blur'
          }
        ],
        email: [
          this.user.email,
          {
            validators: [Validators.required, Validators.email],
            asyncValidators: [this.uniqueEmailValidator],
            updateOn: 'blur'
          }
        ],
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
    if (this.profileForm.valid) {
      this.saveProfile.next(this.mapFormData());
    }
  }

  onReset() {
    this.profileForm.reset({
      lastName: this.user.name,
      firstName: this.user.firstName,
      username: this.user.username,
      email: this.user.email,
      password: '',
      verifyPassword: ''
    });
  }

  private mapFormData(): Partial<PersonInterface> {
    const updatedPerson: Partial<PersonInterface> = {
      name: this.profileForm.value['lastName'],
      firstName: this.profileForm.value['firstName'],
      username: this.profileForm.value['username'],
      email: this.profileForm.value['email']
    };

    if (this.profileForm.value['password']) {
      updatedPerson.password = this.profileForm.value['password'];
    }

    return updatedPerson;
  }
}

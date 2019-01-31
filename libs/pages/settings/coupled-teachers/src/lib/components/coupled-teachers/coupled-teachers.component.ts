import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { PersonInterface } from '@campus/dal';
import { PersonAlreadyLinkedValidator } from '@campus/shared';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CoupledTeachersViewModel } from '../coupled-teachers.viewmodel';

export interface ApiValidationErrors extends ValidationErrors {
  nonExistingTeacherCode?: boolean;
  teacherAlreadyCoupled?: boolean;
  noPublicKey?: boolean;
  apiError?: boolean;
}

@Component({
  selector: 'campus-coupled-teachers',
  templateUrl: './coupled-teachers.component.html',
  styleUrls: ['./coupled-teachers.component.scss']
})
export class CoupledTeachersComponent implements OnInit {
  private teacherCode: string;

  coupledTeachersForm: FormGroup;

  apiErrors$: Observable<ApiValidationErrors>;
  linkedPersons$: Observable<PersonInterface[]>;

  constructor(
    private coupledTeacherViewModel: CoupledTeachersViewModel,
    private formBuilder: FormBuilder,
    private personAlreadyLinkedValidator: PersonAlreadyLinkedValidator
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadStreams();
  }

  private buildForm() {
    this.coupledTeachersForm = this.formBuilder.group({
      teacherCode: [
        this.teacherCode,
        {
          validators: [Validators.required],
          asyncValidators: [this.personAlreadyLinkedValidator],
          updateOn: 'change'
        }
      ]
    });
  }

  loadStreams(): void {
    this.linkedPersons$ = this.coupledTeacherViewModel.linkedPersons$;
    this.apiErrors$ = this.coupledTeacherViewModel.apiErrors$.pipe(
      tap((errors: ApiValidationErrors) => {
        // <mat-error> field will only trigger when the form status is INVALID
        // so we need to manually set the form errors (which will also set the validity of the coupledTeachersForm to INVALID)
        this.coupledTeachersForm.get('teacherCode').setErrors(errors);
      })
    );
  }

  onSubmit() {
    if (this.coupledTeachersForm.valid) {
      this.coupledTeacherViewModel.linkPerson(
        this.coupledTeachersForm.value['teacherCode']
      );
    }
  }

  onUnlink(coupledTeacher: PersonInterface) {
    this.coupledTeacherViewModel.unlinkPerson(coupledTeacher.id);
  }

  onReset() {
    this.coupledTeachersForm.reset({
      teacherCode: this.teacherCode
    });
  }
}

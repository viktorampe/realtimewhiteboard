import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonInterface } from '@campus/dal';
import { PersonAlreadyLinkedValidator } from '@campus/shared';
import { Observable } from 'rxjs';
import {
  ApiValidationErrors,
  CoupledTeachersViewModel
} from '../coupled-teachers.viewmodel';

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
    this.apiErrors$ = this.coupledTeacherViewModel.apiErrors$;
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

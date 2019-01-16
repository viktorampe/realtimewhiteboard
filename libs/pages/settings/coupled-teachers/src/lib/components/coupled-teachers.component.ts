import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { PersonInterface } from '@campus/dal';
import { TeacherAlreadyCoupledValidator } from '@campus/shared';
import { Observable } from 'rxjs';

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

  coupledTeacherViewModel: any; //TODO -- to be replaced by actual vm with DI

  constructor(
    private formBuilder: FormBuilder,
    private teacherAlreadyCoupledValidator: TeacherAlreadyCoupledValidator
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadStreams();
  }

  loadStreams(): void {
    this.linkedPersons$ = this.coupledTeacherViewModel.linkedPersons$;
    this.apiErrors$ = this.coupledTeacherViewModel.apiErrors$;
  }

  private buildForm() {
    this.coupledTeachersForm = this.formBuilder.group({
      teacherCode: [
        this.teacherCode,
        {
          validators: [Validators.required],
          asyncValidators: [this.teacherAlreadyCoupledValidator],
          updateOn: 'change'
        }
      ]
    });
  }

  onSubmit() {
    this.coupledTeacherViewModel.linkPerson(
      this.coupledTeachersForm.value['teacherCode']
    );
  }

  onUnlink(coupledTeacher: PersonInterface) {
    console.log(coupledTeacher);
    this.coupledTeacherViewModel.unlinkPerson(coupledTeacher.id);
  }

  onReset() {
    this.coupledTeachersForm.reset({
      teacherCode: this.teacherCode
    });
  }
}

interface ApiValidationErrors extends ValidationErrors {
  nonExistingTeacherCode: string;
}

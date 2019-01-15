import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { TeacherAlreadyCoupledValidator } from '@campus/shared';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'campus-coupled-teachers',
  templateUrl: './coupled-teachers.component.html',
  styleUrls: ['./coupled-teachers.component.scss']
})
export class CoupledTeachersComponent implements OnInit {
  private teacherCode: string;

  coupledTeachersForm: FormGroup;

  apiErrors$: Observable<ApiValidationErrors>;

  constructor(
    private formBuilder: FormBuilder,
    private teacherAlreadyCoupledValidator: TeacherAlreadyCoupledValidator
  ) {}

  ngOnInit(): void {
    this.apiErrors$ = new BehaviorSubject<ApiValidationErrors>(null);
    this.buildForm();
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
    //TODO -- port action to the vm
    console.log(this.coupledTeachersForm.value['teacherCode']);
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

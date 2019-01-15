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
    this.apiErrors$ = new BehaviorSubject<ApiValidationErrors>({
      nonExistingTeacherCode: 'some error'
    });
    this.buildForm();
  }

  private buildForm() {
    this.coupledTeachersForm = this.formBuilder.group({
      teacherCode: [
        this.teacherCode,
        {
          validators: [Validators.required],
          // asyncValidators: [this.teacherAlreadyCoupledValidator],
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

  check() {
    //TODO -- remove when done
    console.log('%cteacherAlreadyCoupled', 'color: red; font-weight: bold;');
    console.log(
      this.coupledTeachersForm
        .get('teacherCode')
        .getError('teacherAlreadyCoupled')
    );
    console.log('%crequired', 'color: blue; font-weight: bold;');
    console.log(
      this.coupledTeachersForm.get('teacherCode').getError('required')
    );
    console.log('%cform is valid', 'color: green; font-weight: bold;');
    console.log(this.coupledTeachersForm.valid); //REMARK -- for some reason, this is always false, thought there are no errors
  }
}

interface ApiValidationErrors extends ValidationErrors {
  nonExistingTeacherCode: string;
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonInterface } from '@campus/dal';
import { PersonAlreadyLinkedValidator } from '@campus/shared';
import { Observable, Subscription } from 'rxjs';
import {
  ApiValidationErrors,
  CoupledTeachersViewModel
} from '../coupled-teachers.viewmodel';

@Component({
  selector: 'campus-coupled-teachers',
  templateUrl: './coupled-teachers.component.html',
  styleUrls: ['./coupled-teachers.component.scss']
})
export class CoupledTeachersComponent implements OnInit, OnDestroy {
  private teacherCode: string;
  private subscriptions = new Subscription();

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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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

    this.subscriptions.add(
      this.linkedPersons$.subscribe(() => {
        // assume link/unlink was successful when linkedPerson is updated
        this.coupledTeachersForm.reset();
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

import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { PersonInterface } from '@campus/dal';
import { PersonAlreadyLinkedValidator } from '@campus/shared';
import { Observable } from 'rxjs';

export const TEMP_TEACHER_TOKEN = new InjectionToken('browser storage service');

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
    @Inject(TEMP_TEACHER_TOKEN) private coupledTeacherViewModel: any,
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
    console.log('submitting');
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

  getFavoriteAreasString(person: PersonInterface): string {
    if (person.favoriteAreas) {
      let returnString = '';
      for (let i = 0; i < person.favoriteAreas.length; i++) {
        returnString += person.favoriteAreas[i].name;
        if (i < person.favoriteAreas.length - 1) {
          returnString += ', ';
        }
      }
      return returnString;
    }
    return '';
  }

  getDateString(person: PersonInterface): string {
    if (person.linkedAt) {
      return (
        person.linkedAt.getDate() +
        '-' +
        ('0' + (person.linkedAt.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + person.linkedAt.getFullYear()).slice(-2) +
        ' ' +
        ('0' + person.linkedAt.getHours()).slice(-2) +
        ':' +
        ('0' + person.linkedAt.getMinutes()).slice(-2) +
        ':' +
        ('0' + person.linkedAt.getSeconds()).slice(-2)
      );
    }
    return '';
  }
}

interface ApiValidationErrors extends ValidationErrors {
  nonExistingTeacherCode: string;
}

import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { PersonFixture } from '@campus/dal';
import { PersonAlreadyLinkedValidator } from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { CoupledTeachersViewModel } from '../coupled-teachers.viewmodel';
import { MockCoupledTeachersViewModel } from '../coupled-teachers.viewmodel.mock';
import { CoupledTeachersComponent } from './coupled-teachers.component';

const viewmodel = new MockCoupledTeachersViewModel();

describe('CoupledTeachersComponent', () => {
  let component: CoupledTeachersComponent;
  let fixture: ComponentFixture<CoupledTeachersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule,
        ReactiveFormsModule,
        UiModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatInputModule,
        RouterTestingModule,
        MatIconModule
      ],
      declarations: [CoupledTeachersComponent],
      providers: [
        {
          provide: CoupledTeachersViewModel,
          useValue: viewmodel
        },
        {
          provide: PersonAlreadyLinkedValidator,
          useClass: PersonAlreadyLinkedValidator
        },
        {
          provide: FormBuilder,
          useClass: FormBuilder
        },
        {
          provide: Store,
          useClass: StoreModule
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoupledTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 2 coupled teachers', () => {
    const coupledTeachers = fixture.debugElement.queryAll(
      By.css('campus-person-summary')
    );
    expect(coupledTeachers.length).toBe(2);
  });

  it('should call linkPerson when valid form', () => {
    component.coupledTeachersForm.value['teacherCode'] = 'a';
    component.coupledTeachersForm.controls['teacherCode'].setErrors(null);
    fixture.detectChanges();
    const spy = jest.spyOn(viewmodel, 'linkPerson');
    component.onSubmit();
    expect(spy).toHaveBeenCalledWith('a');
  });

  it('should not call linkPerson when invalid form', () => {
    component.coupledTeachersForm.value['teacherCode'] = 'b';
    component.coupledTeachersForm.controls['teacherCode'].setErrors({
      error: true
    });
    fixture.detectChanges();
    const spy = jest.spyOn(viewmodel, 'linkPerson');
    spy.mockReset();
    component.onSubmit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should reset form', () => {
    component.coupledTeachersForm.value['teacherCode'] = 'b';
    component.onReset();
    fixture.detectChanges();
    expect(component.coupledTeachersForm.value['teacherCode']).toBe(null);
  });

  it('should call unlink', () => {
    const spy = jest.spyOn(viewmodel, 'unlinkPerson');
    component.onUnlink(new PersonFixture({ id: 7879 }));
    expect(spy).toHaveBeenCalledWith(7879);
  });
});

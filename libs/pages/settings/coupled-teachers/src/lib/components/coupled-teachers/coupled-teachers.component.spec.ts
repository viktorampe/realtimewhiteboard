import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
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
import { of } from 'rxjs';
import { CoupledTeachersViewModel } from '../coupled-teachers.viewmodel';
import { MockCoupledTeachersViewModel } from '../coupled-teachers.viewmodel.mock';
import { CoupledTeachersComponent } from './coupled-teachers.component';

const viewmodel = new MockCoupledTeachersViewModel();

describe('CoupledTeachersComponent', () => {
  let component: CoupledTeachersComponent;
  let fixture: ComponentFixture<CoupledTeachersComponent>;
  let mockData$: ValidationErrors | null;
  let viewModel: MockCoupledTeachersViewModel;
  let personAlreadyLinkedValidator: PersonAlreadyLinkedValidator;

  const mockFormData = {
    teacherCode: 'foo-teacher-code'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
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
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: CoupledTeachersViewModel,
          useValue: viewmodel
        },
        {
          provide: PersonAlreadyLinkedValidator,
          useValue: { validate: () => of(mockData$) }
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoupledTeachersComponent);
    component = fixture.componentInstance;
    viewModel = TestBed.get(CoupledTeachersViewModel);
    personAlreadyLinkedValidator = TestBed.get(PersonAlreadyLinkedValidator);
    fixture.detectChanges();
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should build the form', () => {
      expect(component.coupledTeachersForm).toBeDefined();
    });
    it('should load the streams', () => {
      expect(component.linkedPersons$).toBeDefined();
    });
  });

  describe('form for linking a teacher', () => {
    describe('form valiation', () => {
      let teacherCodeControl: AbstractControl;

      beforeAll(() => {
        teacherCodeControl = component.coupledTeachersForm.get('teacherCode');
      });

      it('should require a teacher code', () => {
        teacherCodeControl.setValue('');

        expect(teacherCodeControl.errors).toEqual({ required: true });

        mockData$ = { teacherAlreadyCoupled: true };
        teacherCodeControl.setValue('foo');
        expect(teacherCodeControl.errors).toEqual({
          teacherAlreadyCoupled: true
        });
        mockData$ = null;
      });
      it('should check if a teacher is already linked', () => {
        mockData$ = { teacherAlreadyCoupled: true };

        teacherCodeControl.setValue('foo');
        expect(teacherCodeControl.errors).toEqual({
          teacherAlreadyCoupled: true
        });

        mockData$ = null;
      });
    });

    describe('form submission', () => {
      it('should call the linkPerson method with the provided teacher key', () => {
        const linkPersonSpy = jest.spyOn(viewModel, 'linkPerson');
        component.coupledTeachersForm.setValue(mockFormData);

        const submitButton = fixture.debugElement.query(
          By.css('.form-actions > campus-button:nth-child(1)')
        );

        submitButton.nativeElement.click();

        expect(linkPersonSpy).toHaveBeenCalledTimes(1);
        expect(linkPersonSpy).toHaveBeenCalledWith(mockFormData.teacherCode);
      });

      it('should reset the form', () => {
        const onResetSpy = jest.spyOn(component, 'onReset');
        component.coupledTeachersForm.setValue(mockFormData);

        const resetButton = fixture.debugElement.query(
          By.css('.form-actions > campus-button:nth-child(2)')
        );

        resetButton.nativeElement.click();

        expect(onResetSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('unlinking a teacher', () => {
    it('should display 2 coupled teachers', () => {
      const coupledTeachers = fixture.debugElement.queryAll(
        By.css('campus-person-summary')
      );
      expect(coupledTeachers.length).toBe(2);
    });

    it('should call the unlinkPerson method', () => {
      const onUnlinkSpy = jest.spyOn(component, 'onUnlink');
      const unlinkPersonSpy = jest.spyOn(viewModel, 'unlinkPerson');

      const unlinkButton = fixture.debugElement.query(
        By.css('campus-person-summary  campus-button')
      );

      unlinkButton.nativeElement.click();

      expect(onUnlinkSpy).toHaveBeenCalledTimes(1);
      expect(onUnlinkSpy).toHaveBeenCalledWith(viewModel.mockLinkedPersons[0]);

      expect(unlinkPersonSpy).toHaveBeenCalledTimes(1);
      expect(unlinkPersonSpy).toHaveBeenCalledWith(
        viewModel.mockLinkedPersons[0].id
      );
    });

    it('should call unlink', () => {
      const spy = jest.spyOn(viewmodel, 'unlinkPerson');
      component.onUnlink(new PersonFixture({ id: 7879 }));
      expect(spy).toHaveBeenCalledWith(7879);
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
  });
});

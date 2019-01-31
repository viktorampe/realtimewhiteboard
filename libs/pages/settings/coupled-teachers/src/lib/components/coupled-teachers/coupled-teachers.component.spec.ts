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
import { PersonAlreadyLinkedValidator } from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { of } from 'rxjs';
import { CoupledTeachersViewModel } from '../coupled-teachers.viewmodel';
import { MockCoupledTeachersViewModel } from '../coupled-teachers.viewmodel.mock';
import { CoupledTeachersComponent } from './coupled-teachers.component';

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
        MatIconModule,
        RouterTestingModule
      ],
      declarations: [CoupledTeachersComponent],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: CoupledTeachersViewModel,
          useClass: MockCoupledTeachersViewModel
        },
        {
          provide: PersonAlreadyLinkedValidator,
          useValue: { validate: () => of(mockData$) }
        }
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
  });
});

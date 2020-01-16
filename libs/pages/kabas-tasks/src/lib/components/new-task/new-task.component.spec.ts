import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MAT_DIALOG_DATA
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LearningAreaFixture } from '@campus/dal';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { NewTaskComponent } from './new-task.component';

describe('NewTaskComponent', () => {
  let component: NewTaskComponent;
  let fixture: ComponentFixture<NewTaskComponent>;
  let matDialogRef: MatDialogRef<NewTaskComponent>;

  const learningAreas = [
    new LearningAreaFixture({ id: 1, name: 'Frans' }),
    new LearningAreaFixture({ id: 2, name: 'Wiskunde' })
  ];
  const mockInjectedData = { learningAreas };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        UiModule,
        MatDialogModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      declarations: [NewTaskComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockInjectedData },
        { provide: MatDialogRef, useValue: { close: jest.fn() } }
      ]
    });
  });

  beforeEach(() => {
    matDialogRef = TestBed.get(MatDialogRef);
    fixture = TestBed.createComponent(NewTaskComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    it('should hide submit when the form is invalid', () => {
      const submitButton = fixture.debugElement.query(
        By.css('.pages-kabas-tasks-new-task__dialog__actions__button__submit')
      );

      expect(submitButton).toBeFalsy();
    });

    it('should show submit when the form is valid', () => {
      component.newTaskForm.setValue({
        title: 'Abc',
        learningArea: new LearningAreaFixture(),
        type: 'paper'
      });
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('.pages-kabas-tasks-new-task__dialog__actions__button__submit')
      );

      expect(submitButton).toBeTruthy();
    });

    it('should call submit() when clicking the submit button', () => {
      const formData = {
        title: 'Abc',
        learningArea: new LearningAreaFixture(),
        type: 'paper'
      };

      component.newTaskForm.setValue(formData);
      fixture.detectChanges();

      jest.spyOn(component, 'submit');

      const submitButton = fixture.debugElement.query(
        By.css('.pages-kabas-tasks-new-task__dialog__actions__button__submit')
      );
      submitButton.nativeElement.click();

      expect(component.submit).toHaveBeenCalled();
    });

    it('should call cancel() when clicking the cancel button', () => {
      jest.spyOn(component, 'cancel');

      const cancelButton = fixture.debugElement.query(
        By.css('.pages-kabas-tasks-new-task__dialog__actions__button__cancel')
      );
      cancelButton.nativeElement.click();

      expect(component.cancel).toHaveBeenCalled();
    });
  });

  describe('methods', () => {
    it('should submit the form values on submit()', () => {
      const formData = {
        title: 'Abc',
        learningArea: new LearningAreaFixture(),
        type: 'paper'
      };

      component.newTaskForm.setValue(formData);

      component.submit();

      expect(matDialogRef.close).toHaveBeenCalledWith(formData);
    });

    it('should close the dialog with no values on cancel()', () => {
      const formData = {
        title: 'Abc',
        learningArea: new LearningAreaFixture(),
        type: 'paper'
      };

      component.newTaskForm.setValue(formData);

      component.cancel();

      expect(matDialogRef.close).toHaveBeenCalledWith();
    });
  });
});

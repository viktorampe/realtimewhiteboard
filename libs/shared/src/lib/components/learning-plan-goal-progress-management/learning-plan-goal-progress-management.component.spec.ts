import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import {
  ClassGroupFixture,
  EduContentBookFixture,
  LearningPlanGoalFixture
} from '@campus/dal';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { LearningPlanGoalProgressManagementInterface } from './learning-plan-goal-progress-management-dialog.interface';
import { LearningPlanGoalProgressManagementComponent } from './learning-plan-goal-progress-management.component';
import { LearningPlanGoalProgressManagementViewModel } from './learning-plan-goal-progress-management.viewmodel';
import { MockLearningPlanGoalProgressManagementViewModel } from './learning-plan-goal-progress-management.viewmodel.mock';

describe('LearningPlanGoalProgressManagementComponent', () => {
  let component: LearningPlanGoalProgressManagementComponent;
  let fixture: ComponentFixture<LearningPlanGoalProgressManagementComponent>;
  const mockInjectedData: LearningPlanGoalProgressManagementInterface = {
    classGroup: new ClassGroupFixture(),
    learningPlanGoal: new LearningPlanGoalFixture(),
    book: new EduContentBookFixture()
  };

  let lpgpManagementViewModel: LearningPlanGoalProgressManagementViewModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [LearningPlanGoalProgressManagementComponent],
      imports: [MatDialogModule, UiModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockInjectedData },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    })
      .overrideComponent(LearningPlanGoalProgressManagementComponent, {
        set: {
          providers: [
            {
              provide: LearningPlanGoalProgressManagementViewModel,
              useClass: MockLearningPlanGoalProgressManagementViewModel
            }
          ]
        }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      LearningPlanGoalProgressManagementComponent
    );

    lpgpManagementViewModel = fixture.componentRef.injector.get(
      LearningPlanGoalProgressManagementViewModel
    );

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('data and streams', () => {
    describe('data', () => {
      it('should inject the data', () => {
        expect(component.learningPlanGoal).toBe(
          mockInjectedData.learningPlanGoal
        );
        expect(component.classGroup).toBe(mockInjectedData.classGroup);
      });
    });
  });

  describe('event handlers', () => {
    it('closeDialog should close the dialog', () => {
      const dialogRef = TestBed.get(MatDialogRef);
      dialogRef.close = jest.fn();

      component.closeDialog();

      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('saveForUserLesson should call the correct method on the viewmodel and close the dialog', () => {
      lpgpManagementViewModel.createLearningPlanGoalProgressForUserLesson = jest.fn();
      component.closeDialog = jest.fn();

      const userLesson = { description: 'foo' };

      component.saveForUserLesson(userLesson);

      expect(
        lpgpManagementViewModel.createLearningPlanGoalProgressForUserLesson
      ).toHaveBeenCalled();
      expect(
        lpgpManagementViewModel.createLearningPlanGoalProgressForUserLesson
      ).toHaveBeenCalledTimes(1);
      expect(
        lpgpManagementViewModel.createLearningPlanGoalProgressForUserLesson
      ).toHaveBeenCalledWith(
        mockInjectedData.learningPlanGoal,
        mockInjectedData.classGroup,
        userLesson
      );
      expect(component.closeDialog).toHaveBeenCalled();
    });

    it('saveForEduContentTOCselection should call the correct method on the viewmodel and close the dialog', () => {
      lpgpManagementViewModel.createLearningPlanGoalProgressForEduContentTOCs = jest.fn();
      component.closeDialog = jest.fn();

      const eduContentTOCids = [1, 2, 3];

      component.saveForEduContentTOCselection(eduContentTOCids);

      expect(
        lpgpManagementViewModel.createLearningPlanGoalProgressForEduContentTOCs
      ).toHaveBeenCalled();
      expect(
        lpgpManagementViewModel.createLearningPlanGoalProgressForEduContentTOCs
      ).toHaveBeenCalledTimes(1);
      expect(
        lpgpManagementViewModel.createLearningPlanGoalProgressForEduContentTOCs
      ).toHaveBeenCalledWith(
        mockInjectedData.learningPlanGoal,
        mockInjectedData.classGroup,
        eduContentTOCids
      );
      expect(component.closeDialog).toHaveBeenCalled();
    });
  });
});

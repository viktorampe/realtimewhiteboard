import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material';
import { ClassGroupFixture, LearningPlanGoalFixture } from '@campus/dal';
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
    learningPlanGoal: new LearningPlanGoalFixture()
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [LearningPlanGoalProgressManagementComponent],
      imports: [MatDialogModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockInjectedData }]
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

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

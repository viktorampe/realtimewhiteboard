import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassGroupFixture, LearningPlanGoalFixture } from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import { LearningPlanGoalProgressManagementComponent } from './learning-plan-goal-progress-management.component';

describe('LearningPlanGoalProgressManagementComponent', () => {
  let component: LearningPlanGoalProgressManagementComponent;
  let fixture: ComponentFixture<LearningPlanGoalProgressManagementComponent>;
  let mockClassGroup = new ClassGroupFixture();
  let mockLearningPlanGoal = new LearningPlanGoalFixture();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [LearningPlanGoalProgressManagementComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      LearningPlanGoalProgressManagementComponent
    );

    component = fixture.componentInstance;
    component.classGroup = mockClassGroup;
    component.learningPlanGoal = mockLearningPlanGoal;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

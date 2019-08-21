import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LearningPlanGoalProgressManagementComponent } from './learning-plan-goal-progress-management.component';

describe('LearningPlanGoalProgressManagementComponent', () => {
  let component: LearningPlanGoalProgressManagementComponent;
  let fixture: ComponentFixture<LearningPlanGoalProgressManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LearningPlanGoalProgressManagementComponent]
    }).compileComponents();
  }));

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

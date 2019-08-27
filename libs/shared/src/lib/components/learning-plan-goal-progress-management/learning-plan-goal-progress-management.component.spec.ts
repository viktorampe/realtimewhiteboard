import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatListModule,
  MAT_DIALOG_DATA
} from '@angular/material';
import { By } from '@angular/platform-browser';
import {
  ClassGroupFixture,
  EduContentBookFixture,
  LearningPlanGoalFixture
} from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { LearningPlanGoalProgressManagementInterface } from './learning-plan-goal-progress-management-dialog.interface';
import { LearningPlanGoalProgressManagementComponent } from './learning-plan-goal-progress-management.component';
import { LearningPlanGoalProgressManagementViewModel } from './learning-plan-goal-progress-management.viewmodel';

describe('LearningPlanGoalProgressManagementComponent', () => {
  let component: LearningPlanGoalProgressManagementComponent;
  let fixture: ComponentFixture<LearningPlanGoalProgressManagementComponent>;
  const mockInjectedData: LearningPlanGoalProgressManagementInterface = {
    classGroup: new ClassGroupFixture({ name: 'rocky' }),
    learningPlanGoal: new LearningPlanGoalFixture({
      prefix: 'c1QOM0',
      goal: 'situation fuel old select'
    }),
    book: new EduContentBookFixture()
  };

  const mockMethodLessons: { eduContentTocId: number; values: string[] }[] = [
    {
      eduContentTocId: 52,
      values: ['thou', 'store']
    },
    {
      eduContentTocId: 46,
      values: ['arrangement', 'particularly']
    },
    {
      eduContentTocId: 8,
      values: ['quick', 'still']
    },
    {
      eduContentTocId: 67,
      values: ['next', 'part']
    },
    {
      eduContentTocId: 41,
      values: ['older', 'cast']
    }
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [LearningPlanGoalProgressManagementComponent],
      imports: [MatDialogModule, MatListModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockInjectedData }]
    })
      .overrideComponent(LearningPlanGoalProgressManagementComponent, {
        set: {
          providers: [
            {
              provide: LearningPlanGoalProgressManagementViewModel,
              useValue: {
                getMethodLessonsForBook: () => of(mockMethodLessons)
              }
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
  it('should show the title with the group name', () => {
    const title = fixture.debugElement.query(
      By.css('.learning-plan-goal-progress-management__title')
    );
    expect(title.nativeElement.textContent).toBe(
      `Markeer een doel als behandeld voor ${mockInjectedData.classGroup.name}`
    );
  });
  it('should show the learning plan goal prefix and goal', () => {
    const lpg = fixture.debugElement.query(
      By.css('.learning-plan-goal-progress-management__lpg')
    );
    expect(lpg.nativeElement.textContent).toBe(
      `${mockInjectedData.learningPlanGoal.prefix} ${
        mockInjectedData.learningPlanGoal.goal
      }`
    );
  });
  it('should show an option for each methodLesson', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const options = fixture.debugElement.queryAll(
      By.css('.learning-plan-goal-progress-management__list-option')
    );
    expect(options.length).toBe(mockMethodLessons.length);
    options.forEach((option, index) => {
      expect(option.nativeElement.textContent).toBe(
        `${mockMethodLessons[index].values.join(' > ')}`
      );
    });
  });
});

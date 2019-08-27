import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MatListModule,
  MAT_DIALOG_DATA
} from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import {
  ClassGroupFixture,
  EduContentBookFixture,
  LearningPlanGoalFixture
} from '@campus/dal';
import { UiModule } from '@campus/ui';
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
  let lpgpManagementViewModel: LearningPlanGoalProgressManagementViewModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [LearningPlanGoalProgressManagementComponent],
      imports: [MatDialogModule, MatListModule, UiModule],
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

    lpgpManagementViewModel = fixture.componentRef.injector.get(
      LearningPlanGoalProgressManagementViewModel
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

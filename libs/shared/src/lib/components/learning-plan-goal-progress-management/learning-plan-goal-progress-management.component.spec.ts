import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MAT_DIALOG_DATA
} from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ClassGroupFixture,
  EduContentBookFixture,
  LearningPlanGoalFixture,
  UserLessonInterface
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

  const mockUserLessons: UserLessonInterface[] = [
    {
      id: 1,
      description: 'needed guide brown'
    },
    {
      id: 2,
      description: 'fox branch fifteen'
    },
    {
      id: 3,
      description: 'simple importance frog'
    },
    {
      id: 4,
      description: 'fear fireplace with'
    },
    {
      id: 5,
      description: 'brought science kids'
    },
    {
      id: 6,
      description: 'music younger flow'
    }
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [LearningPlanGoalProgressManagementComponent],
      imports: [
        MatDialogModule,
        MatListModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        UiModule
      ],
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
                getMethodLessonsForBook: () => of(mockMethodLessons),
                userLessons$: of(mockUserLessons)
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
  it('should show the autocomplete values when the input is focused', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    const input = fixture.debugElement.query(
      By.css('.learning-plan-goal-progress-management__input')
    );
    const inputElement = input.nativeElement;
    expect(input).toBeTruthy();
    expect(inputElement).toBeTruthy();
    await updateInputValue(inputElement, fixture, '');
    const autocompleteOptions = fixture.debugElement.queryAll(
      By.css('.learning-plan-goal-progress-management__autocomplete-option')
    );
    expect(autocompleteOptions.length).toBe(mockUserLessons.length);
    autocompleteOptions.forEach((autocompleteOption, index) => {
      expect(autocompleteOption.nativeElement.textContent).toBe(
        ` ${mockUserLessons[index].description} `
      );
    });
  });
  it('should show the filtered autocomplete values when the input is focused and a string value was entered', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    const input = fixture.debugElement.query(
      By.css('.learning-plan-goal-progress-management__input')
    );
    const inputElement = input.nativeElement;
    expect(input).toBeTruthy();
    expect(inputElement).toBeTruthy();
    await updateInputValue(inputElement, fixture, 'fire');
    const autocompleteOptions = fixture.debugElement.queryAll(
      By.css('.learning-plan-goal-progress-management__autocomplete-option')
    );
    expect(autocompleteOptions.length).toBe(1);
    expect(autocompleteOptions[0].nativeElement.textContent).toBe(
      ` ${mockUserLessons[3].description} `
    );
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

async function updateInputValue(
  inputElement: any,
  fixture: ComponentFixture<LearningPlanGoalProgressManagementComponent>,
  inputValue: string
) {
  inputElement.dispatchEvent(new Event('focusin'));
  inputElement.value = inputValue;
  inputElement.dispatchEvent(new Event('input'));
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

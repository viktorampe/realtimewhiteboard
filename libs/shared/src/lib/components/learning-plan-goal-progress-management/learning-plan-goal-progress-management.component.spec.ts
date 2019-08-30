import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatSelectionList,
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

  describe('UI', () => {
    it('should show the title with the group name', () => {
      const title = fixture.debugElement.query(
        By.css('.learning-plan-goal-progress-management__title')
      );
      expect(title.nativeElement.textContent).toBe(
        `Markeer een doel als behandeld voor ${
          mockInjectedData.classGroup.name
        }`
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

    it('should call inputFormControl disable if a lessonMethod selection was made', () => {
      component.ngOnInit();
      fixture.detectChanges();
      const formControlSpy = jest.spyOn(component.inputFromControl, 'disable');
      const options = fixture.debugElement.queryAll(
        By.css('.learning-plan-goal-progress-management__list-option')
      );
      expect(options.length).toBe(mockMethodLessons.length);
      options[0].triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(formControlSpy).toHaveBeenCalledTimes(1);
    });

    it('should not disable the input when an autocomplete value is selected', async () => {
      component.ngOnInit();
      fixture.detectChanges();
      const input = fixture.debugElement.query(
        By.css('.learning-plan-goal-progress-management__input')
      );
      const inputElement = input.nativeElement;
      await updateInputValue(inputElement, fixture, 'fire');
      const autocompleteOptions = fixture.debugElement.queryAll(
        By.css('.learning-plan-goal-progress-management__autocomplete-option')
      );
      expect(autocompleteOptions.length).toBe(1);
      autocompleteOptions[0].triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(inputElement.disabled).toBe(false);
    });

    describe('buttons', () => {
      it('should show a close button', () => {
        const buttonDE = fixture.debugElement.query(
          By.css('.learning-plan-goal-progress-management__button--close')
        );

        expect(buttonDE.nativeElement.textContent.trim()).toBe('Sluiten');

        component.closeDialog = jest.fn();
        buttonDE.triggerEventHandler('click', null);

        expect(component.closeDialog).toHaveBeenCalled();
      });

      it('should show a save button, for Userlesson', async () => {
        const input = fixture.debugElement.query(
          By.css('.learning-plan-goal-progress-management__input')
        ).nativeElement;

        await updateInputValue(input, fixture, 'some random string');

        const buttonDE = fixture.debugElement.query(
          By.css('.learning-plan-goal-progress-management__button--save')
        );
        expect(buttonDE.nativeElement.textContent.trim()).toBe(
          'Opslaan (project)'
        );

        component.saveForUserLesson = jest.fn();
        buttonDE.triggerEventHandler('click', null);

        expect(component.saveForUserLesson).toHaveBeenCalled();
      });

      it('should show a save button, for selection', async () => {
        const matList = fixture.debugElement.query(
          By.directive(MatSelectionList)
        ).componentInstance as MatSelectionList;
        matList.selectAll();

        fixture.detectChanges();

        const buttonDE = fixture.debugElement.query(
          By.css('.learning-plan-goal-progress-management__button--save')
        );

        expect(buttonDE.nativeElement.textContent.trim()).toBe(
          'Opslaan (hoofdstuk)'
        );

        component.saveForEduContentTOCselection = jest.fn();
        buttonDE.triggerEventHandler('click', null);

        expect(component.saveForEduContentTOCselection).toHaveBeenCalled();
      });
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

    it('saveForUserLesson should call the correct method on the viewmodel and close the dialog', async () => {
      lpgpManagementViewModel.createLearningPlanGoalProgressForUserLesson = jest.fn();
      component.closeDialog = jest.fn();

      const input = fixture.debugElement.query(
        By.css('.learning-plan-goal-progress-management__input')
      ).nativeElement;

      const description = 'some random string';
      await updateInputValue(input, fixture, description);

      component.saveForUserLesson();

      expect(
        lpgpManagementViewModel.createLearningPlanGoalProgressForUserLesson
      ).toHaveBeenCalled();
      expect(
        lpgpManagementViewModel.createLearningPlanGoalProgressForUserLesson
      ).toHaveBeenCalledTimes(1);
      expect(
        lpgpManagementViewModel.createLearningPlanGoalProgressForUserLesson
      ).toHaveBeenCalledWith(
        mockInjectedData.learningPlanGoal.id,
        mockInjectedData.classGroup.id,
        description,
        mockInjectedData.book.id
      );
      expect(component.closeDialog).toHaveBeenCalled();
    });

    it('saveForEduContentTOCselection should call the correct method on the viewmodel and close the dialog', () => {
      lpgpManagementViewModel.createLearningPlanGoalProgressForEduContentTOCs = jest.fn();
      component.closeDialog = jest.fn();

      const selectionList = fixture.debugElement.query(
        By.css('mat-selection-list')
      ).componentInstance as MatSelectionList;

      selectionList.selectAll();

      const expectedEduContentTOCids = mockMethodLessons.map(
        methodLesson => methodLesson.eduContentTocId
      );

      component.saveForEduContentTOCselection();

      expect(
        lpgpManagementViewModel.createLearningPlanGoalProgressForEduContentTOCs
      ).toHaveBeenCalled();
      expect(
        lpgpManagementViewModel.createLearningPlanGoalProgressForEduContentTOCs
      ).toHaveBeenCalledTimes(1);
      expect(
        lpgpManagementViewModel.createLearningPlanGoalProgressForEduContentTOCs
      ).toHaveBeenCalledWith(
        mockInjectedData.learningPlanGoal.id,
        mockInjectedData.classGroup.id,
        expectedEduContentTOCids,
        mockInjectedData.book.id
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

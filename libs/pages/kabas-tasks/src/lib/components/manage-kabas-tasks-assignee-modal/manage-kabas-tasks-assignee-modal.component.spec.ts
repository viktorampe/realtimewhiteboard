import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MatList,
  MatListItem,
  MatNativeDateModule,
  MAT_DIALOG_DATA
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockDate } from '@campus/testing';
import { DateRangePickerComponent, UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../../interfaces/Assignee.interface';
import { ManageKabasTasksAssigneeDataInterface } from './manage-kabas-tasks-assignee-data.interface';
import { ManageKabasTasksAssigneeModalComponent } from './manage-kabas-tasks-assignee-modal.component';
describe('ManageKabasTasksAssigneeModalComponent', () => {
  let component: ManageKabasTasksAssigneeModalComponent;
  let fixture: ComponentFixture<ManageKabasTasksAssigneeModalComponent>;

  const mockStudentAssignee = {
    type: AssigneeTypesEnum.STUDENT,
    label: 'Pol',
    start: new Date(2020, 0, 1),
    end: new Date(2020, 5, 30)
  };

  const mockGroupAssignee = {
    type: AssigneeTypesEnum.GROUP,
    label: 'zootje ongeregeld',
    start: new Date(2020, 3, 1),
    end: new Date(2020, 3, 30)
  };

  const data: ManageKabasTasksAssigneeDataInterface = {
    title: 'Taak naam',
    // all available taskAssignees
    // these need to include related data (classGroup, group, person)
    classGroups: [],
    groups: [],
    students: [],
    // current values in page
    currentTaskAssignees: [
      { id: 1, ...mockStudentAssignee },
      { id: 1, ...mockGroupAssignee }
    ] as AssigneeInterface[]
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        UiModule,
        MatNativeDateModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { ...data } },
        { provide: MatDialogRef, useValue: { close: () => {} } }
      ],
      declarations: [ManageKabasTasksAssigneeModalComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageKabasTasksAssigneeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject the dialogData', () => {
    expect(component.currentTaskName).toBe(data.title);
    expect(component.currentTaskAssignees).toEqual(data.currentTaskAssignees);
    // TODO these will probably be filtered at some point
    expect(component.availableClassGroups).toEqual(data.classGroups);
    expect(component.availableGroups).toEqual(data.groups);
    expect(component.availableStudents).toEqual(data.students);
  });

  describe('UI elements', () => {
    it('should show a header ', () => {
      const headerDE = fixture.debugElement.query(
        By.css('.manage-task-assignees__title')
      );
      expect(headerDE.nativeElement.textContent.trim()).toBe(
        'Voeg leerlingen toe aan de taak'
      );
    });

    it('should show the task name ', () => {
      const taskNameDE = fixture.debugElement.query(
        By.css('.manage-task-assignees__title__name')
      );
      expect(taskNameDE.nativeElement.textContent.trim()).toBe(data.title);
    });

    it('should show a date picker for the default date', () => {
      const datePicker = fixture.debugElement.query(
        By.css('.manage-task-assignees__title__date-picker')
      ).componentInstance as DateRangePickerComponent;

      expect(datePicker.initialStartDate).toBe(component.default.start);
      expect(datePicker.initialEndDate).toBe(component.default.end);
      expect(datePicker.useTime).toBe(false);
    });

    it('should show a search button', () => {
      const buttonDE = fixture.debugElement.query(
        By.css(
          '.manage-task-assignees__content__add-assignees__container__button'
        )
      );
      expect(buttonDE.nativeElement.textContent.trim()).toBe('Zoeken');

      component.toggleAddAssignees = jest.fn();
      buttonDE.triggerEventHandler('click', null);

      expect(component.toggleAddAssignees).toHaveBeenCalled();
    });

    it('should show a toggle advanced view button', () => {
      const buttonDE = fixture.debugElement.query(
        By.css('.manage-task-assignees__content__show-advanced__button')
      );

      expect(buttonDE.nativeElement.textContent.trim()).toBe(
        'Toon geavanceerd'
      );

      component.toggleAdvancedBoundaries = jest.fn();
      buttonDE.triggerEventHandler('click', null);

      expect(component.toggleAdvancedBoundaries).toHaveBeenCalled();
    });

    it('should show a list of the current assignees', () => {
      const matListDE = fixture.debugElement.query(By.directive(MatList));
      expect(matListDE).toBeTruthy();

      const matListItemDEs = matListDE.queryAll(By.directive(MatListItem));
      expect(matListItemDEs.length).toBe(data.currentTaskAssignees.length);
      matListItemDEs.forEach((listItemDE, index) =>
        expect(listItemDE.nativeElement.textContent).toContain(
          data.currentTaskAssignees[index].label
        )
      );
    });

    it('should show a cancel button', () => {
      const buttonDEs = fixture.debugElement.queryAll(
        By.css('.manage-task-assignees__actions__button')
      );

      expect(buttonDEs[0].nativeElement.textContent.trim()).toBe('Annuleren');

      component.onCancelButtonClick = jest.fn();
      buttonDEs[0].triggerEventHandler('click', null);

      expect(component.onCancelButtonClick).toHaveBeenCalled();
    });

    it('should show a OK button', () => {
      const buttonDEs = fixture.debugElement.queryAll(
        By.css('.manage-task-assignees__actions__button')
      );

      expect(buttonDEs[1].nativeElement.textContent.trim()).toBe('OK');

      component.onOKButtonClick = jest.fn();
      buttonDEs[1].triggerEventHandler('click', null);

      expect(component.onOKButtonClick).toHaveBeenCalled();
    });

    it('should not show a list if there are no assignees', () => {
      // remove all assignees
      component.currentTaskAssignees.forEach(cTA =>
        component.removeAssignee(cTA)
      );
      fixture.detectChanges();

      const matListDE = fixture.debugElement.query(By.directive(MatList));
      expect(matListDE).toBeFalsy();

      const noContentDE = fixture.debugElement.query(
        By.css('.manage-task-assignees__content__list--no-content')
      );
      expect(noContentDE.nativeElement.textContent.trim()).toBe(
        'Er zijn geen items om weer te geven.'
      );
    });
  });

  describe('public methods', () => {
    describe('toggleAdvancedBoundaries', () => {
      it('should toggle', () => {
        expect(component.showAdvancedBoundaries).toBe(false);
        component.toggleAdvancedBoundaries();
        expect(component.showAdvancedBoundaries).toBe(true);
      });
    });

    describe('setDefaultDateRange', () => {
      const start = new Date(3000, 1, 2);
      const end = new Date(3000, 2, 28);

      it('should set the modal default start and end date', () => {
        component.setDefaultDateRange({ start, end });

        expect(component.default).toEqual({ start, end });
      });

      it('should update the assignees with the default date boundaries', () => {
        const assigneesWithDefaults = component.currentTaskAssignees[0];
        component.setDefaultDate(assigneesWithDefaults);

        component.setDefaultDateRange({ start, end });
        expect(assigneesWithDefaults.start).toBe(start);
        expect(assigneesWithDefaults.end).toBe(end);
      });
    });

    describe('toggleAddAssignees', () => {
      it('should toggle the addAssignees visibility', () => {
        const getAddAssigneesDE = () =>
          fixture.debugElement.query(
            By.css('.manage-task-assignees__content__add-assignees')
          );

        expect(getAddAssigneesDE()).toBeFalsy();

        component.toggleAddAssignees();
        fixture.detectChanges();

        expect(getAddAssigneesDE()).toBeTruthy();
      });
    });

    describe('addAssignees', () => {
      const assigneeToAdd = {
        type: AssigneeTypesEnum.STUDENT,
        label: 'Archibald NotInList'
      };

      it('should add the assignees to the list', () => {
        const getMatListOptions = () =>
          fixture.debugElement.queryAll(By.directive(MatListItem));

        const lengthBefore = getMatListOptions().length;

        component.addAssignees([assigneeToAdd]);
        fixture.detectChanges();

        const matListOptions = getMatListOptions();
        const lastMatListOption = matListOptions[matListOptions.length - 1];
        expect(matListOptions.length).toBe(lengthBefore + 1);
        expect(lastMatListOption.nativeElement.textContent).toContain(
          assigneeToAdd.label
        );
      });

      it('should use the modal default boundaries', () => {
        component.addAssignees([assigneeToAdd]);

        const lastAssignee =
          component.currentTaskAssignees[
            component.currentTaskAssignees.length - 1
          ];

        expect(lastAssignee.start).toBe(component.default.start);
        expect(lastAssignee.end).toBe(component.default.end);
      });
    });

    describe('removeAssignee', () => {
      it('should remove the assignee from the list', () => {
        const getMatListOptions = () =>
          fixture.debugElement.queryAll(By.directive(MatListItem));

        const assigneeToRemove = component.currentTaskAssignees[0];
        const lengthBefore = getMatListOptions().length;

        component.removeAssignee(assigneeToRemove);
        fixture.detectChanges();

        const matListOptions = getMatListOptions();
        expect(matListOptions.length).toBe(lengthBefore - 1);
        matListOptions.forEach(matListOption => {
          expect(matListOption.nativeElement.textContent).not.toContain(
            assigneeToRemove.label
          );
        });
      });
    });

    describe('setAssignmentDate', () => {
      it('should set the assignee date boundaries', () => {
        const assignee = component.currentTaskAssignees[0];
        // mocked values dates are in 2020
        const start = new Date(3000, 1, 2);
        const end = new Date(3000, 1, 28);

        component.setAssignmentDate(assignee, { start, end });

        expect(assignee.start).toBe(start);
        expect(assignee.end).toBe(end);
      });
    });

    describe('setDefaultDate', () => {
      it('should set the taskAssignee start and end date', () => {
        const assignee = component.currentTaskAssignees[1];

        component.setAssignmentDate(assignee, {
          start: new Date(3000, 1, 2),
          end: new Date(3000, 2, 28)
        });

        component.setDefaultDate(assignee);

        expect(assignee.start).toEqual(component.default.start);
        expect(assignee.end).toEqual(component.default.end);
      });
    });

    describe('onOKButtonClick', () => {
      it('should close the dialog and emit the taskAssignees', () => {
        const dialogRef = TestBed.get(MatDialogRef);
        dialogRef.close = jest.fn();

        component.onOKButtonClick();
        expect(dialogRef.close).toHaveBeenCalledWith(
          component.currentTaskAssignees
        );
      });
    });

    describe('onCancelButtonClick', () => {
      it('should close the dialog', () => {
        const dialogRef = TestBed.get(MatDialogRef);
        dialogRef.close = jest.fn();

        component.onCancelButtonClick();
        expect(dialogRef.close).toHaveBeenCalledWith();
      });
    });

    describe('isDefaultDate', () => {
      it('should determine if an assignee uses the default boundaries', () => {
        const start = new Date(2020, 1, 2);
        const end = new Date(2020, 2, 30);
        component.setDefaultDateRange({ start, end });

        expect(component.isDefaultDate(start, end)).toBe(true);

        expect(component.isDefaultDate(start, start)).toBe(false);
        expect(component.isDefaultDate(end, end)).toBe(false);
        expect(component.isDefaultDate(end, start)).toBe(false);
      });
    });
  });

  describe('initial values', () => {
    describe('default boundaries date picker', () => {
      const dec31 = new Date(2019, 11, 31);
      const jan1 = new Date(2020, 0, 1);
      const jun30 = new Date(2020, 5, 30);
      const sept1 = new Date(2019, 8, 1);

      // random dates
      const date1 = new Date(2019, 10, 15);
      const date2 = new Date(2019, 10, 30);

      const testCases = [
        {
          it:
            'should use the rest of the schoolyear when there are no assignees, january',
          currentTaskAssignees: [],
          today: jan1,
          expected: { start: jan1, end: jun30 }
        },
        {
          it:
            'should use the rest of the schoolyear when there are no assignees, december',
          currentTaskAssignees: [],
          today: dec31,
          expected: { start: dec31, end: jun30 }
        },
        {
          it: 'should use the single assignee value',
          currentTaskAssignees: [{ start: date1, end: date2 }],
          today: sept1, // not used
          expected: { start: date1, end: date2 }
        },
        {
          it: 'should use the most frequent assigned values',
          currentTaskAssignees: [
            { start: date1, end: date2 },
            { start: date1, end: date2 },
            { start: date1, end: dec31 },
            { start: date2, end: dec31 },
            { start: date2, end: dec31 },
            { start: sept1, end: date1 }
          ],
          today: sept1, // not used
          expected: { start: date1, end: dec31 }
        },
        {
          it: 'should use the most frequent assigned values, ties',
          currentTaskAssignees: [
            { start: date1, end: date2 },
            { start: date2, end: date2 },
            { start: date1, end: dec31 },
            { start: date2, end: dec31 },
            { start: date1, end: dec31 },
            { start: date2, end: date2 }
          ],
          today: sept1, // not used
          // note: since the values are sorted
          // these end up being the ones that appear earliest in the assignees array
          expected: { start: date1, end: date2 }
        }
      ];

      testCases.forEach(testCase => {
        it(testCase.it, () => {
          component[
            'data'
          ].currentTaskAssignees = testCase.currentTaskAssignees as any;
          const mockDate = new MockDate(testCase.today);
          component.ngOnInit();
          expect(component.default).toEqual(testCase.expected);
          mockDate.returnRealDate();
        });
      });
    });
  });

  describe('addAssigneeComponent', () => {
    // TODO
  });
});

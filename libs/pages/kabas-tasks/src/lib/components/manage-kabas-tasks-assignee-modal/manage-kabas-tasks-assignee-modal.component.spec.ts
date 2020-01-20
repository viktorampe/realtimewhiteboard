import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MatIcon,
  MatIconRegistry,
  MatList,
  MatListItem,
  MatNativeDateModule,
  MAT_DIALOG_DATA
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchModule } from '@campus/search';
import { MockDate, MockMatIconRegistry } from '@campus/testing';
import { DateRangePickerComponent, UiModule } from '@campus/ui';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { AssigneeTypesEnum } from '../../interfaces/Assignee.interface';
import { ManageKabasTasksAddAssigneesComponent } from './../manage-kabas-tasks-add-assignees/manage-kabas-tasks-add-assignees.component';
import { ManageKabasTasksAssigneeDataInterface } from './manage-kabas-tasks-assignee-data.interface';
import { ManageKabasTasksAssigneeModalComponent } from './manage-kabas-tasks-assignee-modal.component';

describe('ManageKabasTasksAssigneeModalComponent', () => {
  let component: ManageKabasTasksAssigneeModalComponent;
  let fixture: ComponentFixture<ManageKabasTasksAssigneeModalComponent>;

  const mockStudentAssignee = {
    type: AssigneeTypesEnum.STUDENT,
    label: 'Pol',
    relationId: 1
  };

  const mockStudentAssignee2 = {
    type: AssigneeTypesEnum.STUDENT,
    label: 'Bob',
    relationId: 123
  };

  const mockGroupAssignee = {
    type: AssigneeTypesEnum.GROUP,
    label: 'zootje ongeregeld',
    relationId: 456
  };

  const mockClassGroupAssignee = {
    type: AssigneeTypesEnum.CLASSGROUP,
    label: '2c',
    relationId: 789
  };

  const data: ManageKabasTasksAssigneeDataInterface = {
    title: 'Basic UX design',
    // all available taskAssignees
    possibleTaskClassGroups: [mockClassGroupAssignee],
    possibleTaskGroups: [mockGroupAssignee],
    possibleTaskStudents: [mockStudentAssignee, mockStudentAssignee2],

    // current values in page
    // identical start and end dates
    currentTaskAssignees: [
      {
        id: 1,
        start: new Date(2020, 0, 1),
        end: new Date(2020, 5, 30),
        ...mockStudentAssignee
      },
      {
        id: 1,
        start: new Date(2020, 0, 1),
        end: new Date(2020, 5, 30),
        ...mockGroupAssignee
      }
    ]
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        UiModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        SearchModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { ...data } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: MatIconRegistry,
          useClass: MockMatIconRegistry
        }
      ],
      declarations: [
        ManageKabasTasksAssigneeModalComponent,
        ManageKabasTasksAddAssigneesComponent
      ]
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
    expect(component.currentTaskName).toEqual(data.title);
    expect(component.currentTaskAssignees$.value).toEqual(
      data.currentTaskAssignees
    );

    // values of possibleTaskAssignees are checked is separate describe block
  });

  describe('UI elements', () => {
    it('should show a header ', () => {
      const headerDE = fixture.debugElement.query(
        By.css('.manage-task-assignees__title')
      );
      expect(headerDE.nativeElement.textContent.trim()).toBe(
        'Basic UX design beheren'
      );
    });

    it('should show a date picker for the default date', () => {
      const getDatePickerDE = () =>
        fixture.debugElement.query(
          By.css('.manage-task-assignees__content__date-picker')
        );

      const datePicker = getDatePickerDE()
        .componentInstance as DateRangePickerComponent;

      expect(datePicker.initialStartDate).toBe(component.default.start);
      expect(datePicker.initialEndDate).toBe(component.default.end);
      expect(datePicker.useTime).toBe(false);

      // advanced view
      component.showAdvanced = true;
      fixture.detectChanges();
      expect(getDatePickerDE()).toBe(null);
    });

    it('should show an add-assignee icon', () => {
      const iconDE = fixture.debugElement.query(
        By.css('.manage-task-assignees__title__action')
      );

      const icon = iconDE.componentInstance as MatIcon;
      expect(icon.svgIcon).toBe('add');

      component.toggleAddAssignees = jest.fn();
      iconDE.triggerEventHandler('click', null);

      expect(component.toggleAddAssignees).toHaveBeenCalled();
    });

    it('should show a toggle advanced view link', () => {
      const getLinkDE = () =>
        fixture.debugElement.query(
          By.css('.manage-task-assignees__content__header__view-toggle')
        );

      let linkDE = getLinkDE();

      expect(linkDE.nativeElement.textContent.trim()).toBe(
        '(Gebruik verschillende datums)'
      );

      component.setShowAdvanced = jest.fn();
      linkDE.triggerEventHandler('click', null);

      expect(component.setShowAdvanced).toHaveBeenCalled();

      // advanced view
      component.showAdvanced = true;
      fixture.detectChanges();

      linkDE = getLinkDE();
      expect(linkDE.nativeElement.textContent.trim()).toBe('(Gebruik 1 datum)');
    });

    it('should show a add assignees list item', () => {
      const addMatListItem = fixture.debugElement.query(
        By.css('.manage-task-assignees__content__list__item--add')
      );
      expect(addMatListItem.nativeElement.textContent.trim()).toBe(
        'Deze taak toewijzen...'
      );
    });

    it('should show a list of the current assignees', () => {
      const matListDE = fixture.debugElement.query(By.directive(MatList));
      expect(matListDE).toBeTruthy();

      const [addMatListItem, ...matListItemDEs] = matListDE.queryAll(
        By.directive(MatListItem)
      );
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
  });

  describe('public methods', () => {
    describe('setDefaultDateRange', () => {
      const start = new Date(3000, 1, 2);
      const end = new Date(3000, 2, 28);

      it('should set the modal default start and end date', () => {
        component.setDefaultDateRange({ start, end });

        expect(component.default).toEqual({ start, end });
      });

      it('should update the assignees with the default date boundaries', () => {
        const assigneesWithDefaults = component.currentTaskAssignees$.value[0];
        component.setAssignmentDate([assigneesWithDefaults], {
          start: new Date(3000, 0, 1),
          end: new Date(3000, 0, 1)
        });

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

    describe('setShowAdvanced', () => {
      it('should set showAdvanced', () => {
        component.setShowAdvanced(true);
        expect(component.showAdvanced).toBe(true);

        component.setShowAdvanced(false);
        expect(component.showAdvanced).toBe(false);
      });

      it('set to false should reset all assignees to default date values', () => {
        component.default = {
          start: new Date(3000, 1, 1),
          end: new Date(3000, 2, 2)
        };
        component.setShowAdvanced(false);

        const expected = data.currentTaskAssignees.map(cTA => ({
          ...cTA,
          ...component.default
        }));
        expect(component.currentTaskAssignees$).toBeObservable(
          hot('a', { a: expected })
        );
      });
    });

    describe('addAssignees', () => {
      const assigneeToAdd = mockStudentAssignee2;

      it('should add the assignees to the list', () => {
        const currentTaskAssigneesBefore =
          component.currentTaskAssignees$.value;

        component.addAssignees([assigneeToAdd]);

        const expected = [
          ...currentTaskAssigneesBefore,
          jasmine.objectContaining(assigneeToAdd)
        ];
        expect(component.currentTaskAssignees$).toBeObservable(
          hot('a', { a: expected })
        );
      });

      it('should use the modal default boundaries', () => {
        component.addAssignees([assigneeToAdd]);

        const lastAssignee =
          component.currentTaskAssignees$.value[
            data.currentTaskAssignees.length - 1
          ];

        expect(lastAssignee.start).toEqual(component.default.start);
        expect(lastAssignee.end).toEqual(component.default.end);
      });

      it('should update the available assignees', () => {
        component.addAssignees([assigneeToAdd]);

        expect(component.availableTaskClassGroups$).toBeObservable(
          hot('a', {
            a: data.possibleTaskClassGroups
          })
        );
      });
    });

    describe('removeAssignee', () => {
      it('should remove the assignee from the list', () => {
        const getMatListOptions = () =>
          fixture.debugElement.queryAll(By.directive(MatListItem));

        const assigneeToRemove = component.currentTaskAssignees$.value[0];
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

      it('should update the available assignees', () => {
        const assigneeToRemove = component.currentTaskAssignees$.value[0];

        component.removeAssignee(assigneeToRemove);

        expect(component.availableTaskStudents$).toBeObservable(
          hot('a', {
            a: [mockStudentAssignee, mockStudentAssignee2]
          })
        );
      });

      it('should switch to basic view if the list is empty', () => {
        component.currentTaskAssignees$.next([mockClassGroupAssignee]);
        component.showAdvanced = true;

        component.removeAssignee(mockClassGroupAssignee);

        expect(component.showAdvanced).toBe(false);
      });
    });

    describe('setAssignmentDate', () => {
      it('should set the assignee date boundaries', () => {
        const assignee = component.currentTaskAssignees$.value[0];
        // mocked values dates are in 2020
        const start = new Date(3000, 1, 2);
        const end = new Date(3000, 1, 28);

        component.setAssignmentDate([assignee], { start, end });

        expect(assignee.start).toBe(start);
        expect(assignee.end).toBe(end);
      });
    });

    describe('onOKButtonClick', () => {
      it('should close the dialog and emit the taskAssignees', () => {
        const dialogRef = TestBed.get(MatDialogRef);
        dialogRef.close = jest.fn();

        component.onOKButtonClick();
        expect(dialogRef.close).toHaveBeenCalledWith(
          component.currentTaskAssignees$.value
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
  });

  describe('initial values', () => {
    describe('default boundaries date picker', () => {
      afterEach(() => {
        component['data'].currentTaskAssignees = data.currentTaskAssignees;
      });

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
          const mockDate = new MockDate(testCase.today);

          component[
            'data'
          ].currentTaskAssignees = testCase.currentTaskAssignees as any;
          component.ngOnInit();

          expect(component.default).toEqual(testCase.expected);

          // restore everything to normal
          mockDate.returnRealDate();
        });
      });
    });

    describe('available assignees', () => {
      it('should only contain values that are not currently selected', () => {
        expect(component.availableTaskClassGroups$).toBeObservable(
          hot('a', {
            a: [mockClassGroupAssignee]
          })
        );
        expect(component.availableTaskGroups$).toBeObservable(
          hot('a', {
            a: []
          })
        );
        expect(component.availableTaskStudents$).toBeObservable(
          hot('a', {
            a: [mockStudentAssignee2]
          })
        );
      });

      it('should contain all possible assignees', () => {
        component.currentTaskAssignees$.next([]);
        expect(component.availableTaskClassGroups$).toBeObservable(
          hot('a', {
            a: data.possibleTaskClassGroups
          })
        );
        expect(component.availableTaskGroups$).toBeObservable(
          hot('a', {
            a: data.possibleTaskGroups
          })
        );
        expect(component.availableTaskStudents$).toBeObservable(
          hot('a', {
            a: data.possibleTaskStudents
          })
        );
      });
    });
  });

  describe('addAssigneeComponent', () => {
    beforeEach(() => {
      component.showAddAssignees = true;
      fixture.detectChanges();
    });

    describe('UI elements', () => {
      it('should show a header ', () => {
        const headerDE = fixture.debugElement.query(
          By.css('.manage-task-assignees__title')
        );
        expect(headerDE.nativeElement.textContent.trim()).toBe(
          'Basic UX design toewijzen aan'
        );
      });

      it('should show a back icon', () => {
        const iconDE = fixture.debugElement.query(
          By.css('.manage-task-assignees__title__action')
        );

        const icon = iconDE.componentInstance as MatIcon;
        expect(icon.svgIcon).toBe('arrow-back');

        component.toggleAddAssignees = jest.fn();
        iconDE.triggerEventHandler('click', null);

        expect(component.toggleAddAssignees).toHaveBeenCalled();
      });
    });

    describe('inputs', () => {
      it('should set inputs', () => {
        const getAddAssigneeComponentDE = () =>
          fixture.debugElement.query(
            By.css('.manage-task-assignees__content__add-assignees')
          );

        component.currentTaskAssignees$.next([]);
        fixture.detectChanges();

        const addAssigneesComponent = getAddAssigneeComponentDE()
          .componentInstance as ManageKabasTasksAddAssigneesComponent;

        expect(addAssigneesComponent.classgroups).toEqual(
          data.possibleTaskClassGroups
        );
        expect(addAssigneesComponent.groups).toEqual(data.possibleTaskGroups);
        expect(addAssigneesComponent.students).toEqual(
          data.possibleTaskStudents
        );
      });
    });
  });
});

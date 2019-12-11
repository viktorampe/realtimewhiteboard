import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatBadgeModule,
  MatDatepickerModule,
  MatInputModule,
  MatMenuModule,
  MatNativeDateModule,
  MatRadioModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockDate } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { UtilsModule } from '@campus/utils';
import { configureTestSuite } from 'ng-bullet';
import { SearchFilterCriteriaFixture } from '../../+fixtures/search-filter-criteria.fixture';
import {
  DateFilterComponent,
  RadioOption,
  RadioOptionValueType
} from './date-filter.component';

describe('DateFilterComponent', () => {
  let component: DateFilterComponent;
  let fixture: ComponentFixture<DateFilterComponent>;

  const fakeDate = new Date(2019, 11, 11, 8, 16, 32, 64);
  const startOfWeek = new Date(2019, 11, 9, 0, 0, 0, 0);
  const startOfWeekPlusOneDay = new Date(2019, 11, 10, 0, 0, 0, 0);
  const endOfWeek = new Date(2019, 11, 15, 23, 59, 59, 999);
  const startOfLastWeek = new Date(2019, 11, 2, 0, 0, 0, 0);
  const endOfLastWeek = new Date(2019, 11, 8, 23, 59, 59, 999);
  const startOfNextWeek = new Date(2019, 11, 16, 0, 0, 0, 0);
  const someStartDate = new Date(2019, 0, 5, 8, 16, 32, 64);
  const someStartDateAtStartOfDay = new Date(2019, 0, 5, 0, 0, 0, 0);
  const someStartDateAtEndOfDay = new Date(2019, 0, 5, 23, 59, 59, 999);
  const someEndDate = new Date(2019, 0, 8, 8, 16, 32, 64);
  const someEndDateAtStartOfDay = new Date(2019, 0, 8, 0, 0, 0, 0);
  const someEndDateAtEndOfDay = new Date(2019, 0, 8, 23, 59, 59, 999);
  let mockDate: MockDate;

  const expectedOptions: RadioOption[] = [
    {
      viewValue: 'Deze week',
      value: {
        type: RadioOptionValueType.FilterCriteriaValue,
        contents: {
          data: {
            gte: startOfWeek,
            lte: endOfWeek
          }
        }
      }
    },
    {
      viewValue: 'Vorige week',
      value: {
        type: RadioOptionValueType.FilterCriteriaValue,
        contents: {
          data: {
            gte: startOfLastWeek,
            lte: endOfLastWeek
          }
        }
      }
    }
  ];

  const mockCriteria = new SearchFilterCriteriaFixture(
    {
      name: 'createdAt',
      label: 'Aanmaakdatum'
    },
    []
  );

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatBadgeModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatMenuModule,
        MatRadioModule,
        UiModule,
        NoopAnimationsModule,
        UtilsModule
      ],
      declarations: [DateFilterComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFilterComponent);
    component = fixture.componentInstance;
    component.filterCriteria = mockCriteria;

    fixture.detectChanges();

    mockDate = new MockDate(fakeDate);
  });

  afterAll(() => {
    mockDate.returnRealDate();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('radio options', () => {
    it('should have the correct options', () => {
      expect(component.options).toEqual(expectedOptions);
    });

    it('should have a reset option when the reset label is set', () => {
      const label = 'Geen';

      component.resetLabel = label;
      fixture.detectChanges();

      expect(component.options).toEqual([
        {
          viewValue: label,
          value: {
            type: RadioOptionValueType.NoFilter
          }
        },
        ...expectedOptions
      ]);
    });

    describe('value changes', () => {
      describe('fixed option', () => {
        beforeEach(() => {
          component.startDate.enable();
          component.endDate.enable();
          component.dateSelection.setValue(expectedOptions[0].value);

          fixture.detectChanges();
        });

        it('should disable startDate and endDate', () => {
          expect(component.startDate.disabled).toBeTruthy();
          expect(component.endDate.disabled).toBeTruthy();
        });

        it('should set criteria values to the selected value', () => {
          expect(component.criteria.values).toEqual([
            expectedOptions[0].value.contents
          ]);
        });
      });

      describe('reset option', () => {
        beforeEach(() => {
          component.startDate.enable();
          component.endDate.enable();
          component.dateSelection.setValue({
            type: RadioOptionValueType.NoFilter
          });

          fixture.detectChanges();
        });

        it('should disable startDate and endDate', () => {
          expect(component.startDate.disabled).toBeTruthy();
          expect(component.endDate.disabled).toBeTruthy();
        });

        it('should set criteria values to an empty array', () => {
          expect(component.criteria.values).toEqual([]);
        });
      });

      describe('range option', () => {
        beforeEach(() => {
          jest.spyOn(component, 'onDateChange');

          component.startDate.disable();
          component.endDate.disable();
          component.dateSelection.setValue({
            type: RadioOptionValueType.CustomRange
          });

          fixture.detectChanges();
        });

        it('should enable startDate and endDate', () => {
          expect(component.startDate.enabled).toBeTruthy();
          expect(component.endDate.enabled).toBeTruthy();
        });

        it('should call date change once', () => {
          expect(component.onDateChange).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('date range selection', () => {
    describe('value changes', () => {
      it('should set start date to end date when end date is lower than start date', () => {
        component.startDate.setValue(someEndDate);
        component.endDate.setValue(someStartDate);

        expect(component.startDate.value).toEqual(someStartDateAtStartOfDay);
        expect(component.endDate.value).toEqual(someStartDateAtEndOfDay);
      });

      it('should set end date to start date when start date is higher than end date', () => {
        component.endDate.setValue(someStartDate);
        component.startDate.setValue(someEndDate);

        expect(component.startDate.value).toEqual(someEndDateAtStartOfDay);
        expect(component.endDate.value).toEqual(someEndDateAtEndOfDay);
      });

      it('should set criteria values correctly', () => {
        component.startDate.setValue(someStartDate);
        component.endDate.setValue(someEndDate);

        expect(component.criteria.values).toEqual([
          {
            data: {
              gte: someStartDateAtStartOfDay,
              lte: someEndDateAtEndOfDay
            }
          }
        ]);
      });

      it('should set criteria values correctly - no dates entered', () => {
        component.startDate.setValue(null);
        component.endDate.setValue(null);

        expect(component.criteria.values).toEqual([]);
      });
    });
  });

  describe('applyFilter', () => {
    it('should close the mat menu', () => {
      jest.spyOn(component.matMenuTrigger, 'closeMenu');

      component.applyFilter();

      expect(component.matMenuTrigger.closeMenu).toHaveBeenCalled();
    });

    it('should emit the filter criteria', () => {
      component.criteria.values = [expectedOptions[0].value.contents];
      jest.spyOn(component.filterSelectionChange, 'emit');

      component.applyFilter();

      expect(component.filterSelectionChange.emit).toHaveBeenCalledWith([
        {
          ...mockCriteria,
          values: [expectedOptions[0].value.contents]
        }
      ]);
    });

    it('should update the view', () => {
      jest.spyOn(component, 'updateView');

      component.applyFilter();

      expect(component.updateView).toHaveBeenCalled();
    });

    describe('cancel = true', () => {
      it('should close the mat menu', () => {
        jest.spyOn(component.matMenuTrigger, 'closeMenu');

        component.applyFilter(true);

        expect(component.matMenuTrigger.closeMenu).toHaveBeenCalled();
      });

      it('should emit the filter criteria', () => {
        jest.spyOn(component.filterSelectionChange, 'emit');

        component.applyFilter(true);

        expect(component.filterSelectionChange.emit).not.toHaveBeenCalled();
      });

      it('should update the view', () => {
        jest.spyOn(component, 'updateView');

        component.applyFilter(true);

        expect(component.updateView).not.toHaveBeenCalled();
      });
    });
  });

  describe('updateView', () => {
    describe('customDisplayLabel', () => {
      it('should be null when the chosen option is no filter', () => {
        component.dateSelection.setValue({
          type: RadioOptionValueType.NoFilter
        });

        component.updateView();

        expect(component.customDisplayLabel).toBe(null);
      });

      it('should be the date range when the chosen option is a fixed option', () => {
        component.dateSelection.setValue(expectedOptions[0].value);

        component.updateView();

        expect(component.customDisplayLabel).toBe(
          'Vanaf ' +
            startOfWeek.toLocaleDateString() +
            ' tot en met ' +
            endOfWeek.toLocaleDateString()
        );
      });

      it('should be the date range when the chosen option is a custom range', () => {
        component.dateSelection.setValue({
          type: RadioOptionValueType.CustomRange
        });
        component.startDate.setValue(startOfWeek);
        component.endDate.setValue(endOfWeek);

        component.updateView();

        expect(component.customDisplayLabel).toBe(
          'Vanaf ' +
            startOfWeek.toLocaleDateString() +
            ' tot en met ' +
            endOfWeek.toLocaleDateString()
        );
      });

      it('should be null when the chosen option is a custom range - no dates selected', () => {
        component.dateSelection.setValue({
          type: RadioOptionValueType.CustomRange
        });
        component.startDate.setValue(null);
        component.endDate.setValue(null);

        component.updateView();

        expect(component.customDisplayLabel).toBe(null);
      });

      it('should be the start date when the chosen option is a custom range - only start date', () => {
        component.dateSelection.setValue({
          type: RadioOptionValueType.CustomRange
        });
        component.startDate.setValue(startOfWeek);
        component.endDate.setValue(null);

        component.updateView();

        expect(component.customDisplayLabel).toBe(
          'Vanaf ' + startOfWeek.toLocaleDateString()
        );
      });

      it('should be the end date when the chosen option is a custom range - only end date', () => {
        component.dateSelection.setValue({
          type: RadioOptionValueType.CustomRange
        });
        component.startDate.setValue(null);
        component.endDate.setValue(endOfWeek);

        component.updateView();

        expect(component.customDisplayLabel).toBe(
          'Tot en met ' + endOfWeek.toLocaleDateString()
        );
      });
    });

    describe('count', () => {
      it('should be 0 when the chosen option is no filter', () => {
        component.dateSelection.setValue({
          type: RadioOptionValueType.NoFilter
        });

        component.updateView();

        expect(component.count).toBe(0);
      });

      it('should be 1 when the chosen option is a fixed option', () => {
        component.dateSelection.setValue(expectedOptions[0].value);

        component.updateView();

        expect(component.count).toBe(1);
      });

      it('should be 1 when the chosen option is a custom range', () => {
        component.dateSelection.setValue({
          type: RadioOptionValueType.CustomRange
        });
        component.startDate.setValue(startOfWeek);
        component.endDate.setValue(endOfWeek);

        component.updateView();

        expect(component.count).toBe(1);
      });

      it('should be 0 when the chosen option is a custom range - no dates selected', () => {
        component.dateSelection.setValue({
          type: RadioOptionValueType.CustomRange
        });
        component.startDate.setValue(null);
        component.endDate.setValue(null);

        component.updateView();

        expect(component.count).toBe(0);
      });

      it('should be 1 the chosen option is a custom range - only start date', () => {
        component.dateSelection.setValue({
          type: RadioOptionValueType.CustomRange
        });
        component.startDate.setValue(startOfWeek);
        component.endDate.setValue(null);

        component.updateView();

        expect(component.count).toBe(1);
      });

      it('should be 1 when the chosen option is a custom range - only end date', () => {
        component.dateSelection.setValue({
          type: RadioOptionValueType.CustomRange
        });
        component.startDate.setValue(null);
        component.endDate.setValue(endOfWeek);

        component.updateView();

        expect(component.count).toBe(1);
      });
    });
  });

  describe('applyClassToDateRange', () => {
    describe('range selected', () => {
      beforeEach(() => {
        component.startDate.setValue(startOfWeek);
        component.endDate.setValue(endOfWeek);
      });

      it('should calculate right class - under range', () => {
        const classValue = component.applyClassToDateInRange(startOfLastWeek);

        expect(classValue).toBeUndefined();
      });

      it('should calculate right class - above range', () => {
        const classValue = component.applyClassToDateInRange(startOfNextWeek);

        expect(classValue).toBeUndefined();
      });

      it('should calculate right class - on range start', () => {
        const classValue = component.applyClassToDateInRange(startOfWeek);

        expect(classValue).toEqual(
          'date-filter-component__menu-panel__date-range__day--in-range-first'
        );
      });

      it('should calculate right class - on range end', () => {
        const classValue = component.applyClassToDateInRange(endOfWeek);

        expect(classValue).toEqual(
          'date-filter-component__menu-panel__date-range__day--in-range-last'
        );
      });

      it('should calculate right class - same day as start and end', () => {
        component.startDate.setValue(startOfWeek);
        component.endDate.setValue(startOfWeek);

        const classValue = component.applyClassToDateInRange(startOfWeek);

        expect(classValue).toEqual(
          'date-filter-component__menu-panel__date-range__day--in-range-single'
        );
      });

      it('should calculate right class - inside range', () => {
        const classValue = component.applyClassToDateInRange(
          startOfWeekPlusOneDay
        );

        expect(classValue).toEqual(
          'date-filter-component__menu-panel__date-range__day--in-range'
        );
      });
    });

    describe('one date selected', () => {
      it('should calculate right class - only start date specified', () => {
        component.startDate.setValue(startOfWeek);
        component.endDate.setValue(null);

        const classValue = component.applyClassToDateInRange(startOfWeek);

        expect(classValue).toEqual(
          'date-filter-component__menu-panel__date-range__day--in-range-single'
        );
      });

      it('should calculate right class - only end date specified', () => {
        component.startDate.setValue(null);
        component.endDate.setValue(endOfWeek);

        const classValue = component.applyClassToDateInRange(endOfWeek);

        expect(classValue).toEqual(
          'date-filter-component__menu-panel__date-range__day--in-range-single'
        );
      });
    });
  });
});

import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatBadge,
  MatBadgeModule,
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelect,
  MatSelectModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockDate } from '@campus/testing';
import { UtilsModule } from '@campus/utils';
import { configureTestSuite } from 'ng-bullet';
import { SearchFilterCriteriaFixture } from '../../+fixtures/search-filter-criteria.fixture';
import { DateFilterComponent } from './date-filter.component';

describe('DateFilterComponent', () => {
  let component: DateFilterComponent;
  let fixture: ComponentFixture<DateFilterComponent>;
  let matSelect: DebugElement;
  let matSelectComponent: MatSelect;
  let matBadge: DebugElement;

  const fakeDate = new Date(2019, 11, 11, 8, 16, 32, 64);
  const startOfWeek = new Date(2019, 11, 9, 0, 0, 0, 0);
  const endOfWeek = new Date(2019, 11, 15, 23, 59, 59, 999);
  const startOfLastWeek = new Date(2019, 11, 2, 0, 0, 0, 0);
  const endOfLastWeek = new Date(2019, 11, 8, 23, 59, 59, 999);
  const someStartDate = new Date(2019, 0, 5, 8, 16, 32, 64);
  const someStartDateNormalized = new Date(2019, 0, 5, 0, 0, 0, 0);
  const someEndDate = new Date(2019, 0, 5, 16, 16, 32, 64);
  const someEndDateNormalized = new Date(2019, 0, 5, 23, 59, 59, 999);
  let mockDate: MockDate;

  const expectedOptions = [
    {
      viewValue: 'Deze week',
      value: {
        data: {
          gte: startOfWeek,
          lte: endOfWeek
        }
      }
    },
    {
      viewValue: 'Vorige week',
      value: {
        data: {
          gte: startOfLastWeek,
          lte: endOfLastWeek
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
        MatSelectModule,
        ReactiveFormsModule,
        MatBadgeModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
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
    matSelect = fixture.debugElement.query(By.directive(MatSelect));
    matSelectComponent = matSelect.componentInstance as MatSelect;
    matBadge = fixture.debugElement.query(By.directive(MatBadge));

    fixture.detectChanges();

    mockDate = new MockDate(fakeDate);
  });

  afterAll(() => {
    mockDate.returnRealDate();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the right fixed options in the mat-select component', () => {
    const matSelectOptions = matSelectComponent.options.map(option => {
      return {
        value: option.value,
        viewValue: option.viewValue
      };
    });

    expect(matSelectOptions).toEqual(expectedOptions);
  });

  it('should clear the selected date range and custom label when selecting a fixed option', () => {
    component.startDate.setValue(someStartDate);
    component.endDate.setValue(someEndDate);

    component.selectControl.setValue(expectedOptions[0].value);

    expect(component.startDate.value).toBe(null);
    expect(component.endDate.value).toBe(null);
    expect(component.customDisplayLabel).toBeFalsy();
  });

  it('should emit the selected option with its value', () => {
    jest.spyOn(component.filterSelectionChange, 'emit');

    component.selectControl.setValue(expectedOptions[0].value);

    expect(component.filterSelectionChange.emit).toHaveBeenCalledWith([
      {
        ...mockCriteria,
        values: [expectedOptions[0].value]
      }
    ]);
  });

  describe('date range selection - from only', () => {
    beforeEach(() => {
      jest.spyOn(component.filterSelectionChange, 'emit');

      component.startDate.setValue(someStartDate);

      fixture.detectChanges();
    });

    it('should emit the selected date range', () => {
      expect(component.filterSelectionChange.emit).toHaveBeenCalledWith([
        {
          ...mockCriteria,
          values: [
            {
              data: {
                gte: someStartDateNormalized,
                lte: null
              }
            }
          ]
        }
      ]);
    });

    it('should show the correct display label', () => {
      expect(matSelectComponent.placeholder).toBe(
        'Vanaf ' + someStartDateNormalized.toLocaleDateString()
      );
    });
  });

  describe('date range selection - to only', () => {
    beforeEach(() => {
      jest.spyOn(component.filterSelectionChange, 'emit');

      component.endDate.setValue(someStartDate);

      fixture.detectChanges();
    });

    it('should emit the selected date range', () => {
      expect(component.filterSelectionChange.emit).toHaveBeenCalledWith([
        {
          ...mockCriteria,
          values: [
            {
              data: {
                gte: null,
                lte: someEndDateNormalized
              }
            }
          ]
        }
      ]);
    });

    it('should show the correct display label', () => {
      expect(matSelectComponent.placeholder).toBe(
        'Tot en met ' + someEndDateNormalized.toLocaleDateString()
      );
    });
  });

  describe('date range selection - from and to', () => {
    beforeEach(() => {
      jest.spyOn(component.filterSelectionChange, 'emit');

      component.startDate.setValue(someStartDate);
      component.endDate.setValue(someEndDate);

      fixture.detectChanges();
    });

    it('should emit the selected date range', () => {
      expect(component.filterSelectionChange.emit).toHaveBeenCalledWith([
        {
          ...mockCriteria,
          values: [
            {
              data: {
                gte: someStartDateNormalized,
                lte: someEndDateNormalized
              }
            }
          ]
        }
      ]);
    });

    it('should show the correct display label', () => {
      expect(matSelectComponent.placeholder).toBe(
        'Vanaf ' +
          someStartDateNormalized.toLocaleDateString() +
          ' tot en met ' +
          someEndDateNormalized.toLocaleDateString()
      );
    });
  });

  describe('counter for badge', () => {
    it('should be 0 when nothing is selected', () => {
      expect(component.count).toBe(0);
    });

    it('should be 1 when an option is selected', () => {
      component.selectControl.setValue(expectedOptions[0].value);
      expect(component.count).toBe(1);
    });

    it('should be 1 when a date range is selected', () => {
      component.startDate.setValue(someStartDate);
      component.endDate.setValue(someEndDate);

      expect(component.count).toBe(1);
    });
  });

  describe('reset option', () => {
    let matSelectOptions;

    beforeEach(() => {
      component.resetLabel = 'resetFoo';
      fixture.detectChanges();

      matSelectOptions = matSelectComponent.options.map(option => {
        return {
          value: option.value,
          viewValue: option.viewValue
        };
      });
    });

    it('should add the reset option to the select list when it is set', () => {
      expect(matSelectOptions[0]).toEqual({
        viewValue: 'resetFoo',
        value: null
      });
    });

    it('should clear the filter when reset is chosen', () => {
      jest.spyOn(component.filterSelectionChange, 'emit');

      component.selectControl.setValue(matSelectOptions[0].value);

      expect(component.filterSelectionChange.emit).toHaveBeenCalledWith([
        {
          ...mockCriteria,
          values: []
        }
      ]);
    });
  });
});

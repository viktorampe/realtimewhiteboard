import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from '../../+fixtures/search-filter-criteria.fixture';
import { SearchFilterCriteriaInterface } from '../../interfaces/search-filter-criteria.interface';
import { ColumnFilterComponent } from './column-filter.component';

const mockFilterCriteria: SearchFilterCriteriaInterface[] = [
  new SearchFilterCriteriaFixture({}, [
    new SearchFilterCriteriaValuesFixture({ selected: false }),
    new SearchFilterCriteriaValuesFixture({ selected: false }),
    new SearchFilterCriteriaValuesFixture({ selected: false }),
    new SearchFilterCriteriaValuesFixture({ selected: false })
  ]),
  new SearchFilterCriteriaFixture({}, [
    new SearchFilterCriteriaValuesFixture({
      selected: false,
      prediction: undefined
    }),
    new SearchFilterCriteriaValuesFixture({
      selected: false,
      prediction: null
    }),
    new SearchFilterCriteriaValuesFixture({ selected: false, prediction: 0 }),
    new SearchFilterCriteriaValuesFixture({ selected: false }),
    new SearchFilterCriteriaValuesFixture({ selected: false }),
    new SearchFilterCriteriaValuesFixture({ selected: false }),
    new SearchFilterCriteriaValuesFixture({ selected: false })
  ])
];

describe('ColumnFilterComponent', () => {
  let component: ColumnFilterComponent;
  let fixture: ComponentFixture<ColumnFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColumnFilterComponent],
      imports: [MatListModule, NoopAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('filterCriteria input setter', () => {
    it('should not change forwardAnimation and previousFilterCriteriaCount if passed value is undefined', () => {
      component.filterCriteria = undefined;
      fixture.detectChanges();
      expect(component.forwardAnimation).toBe(true);
      expect(component['previousFilterCriteriaCount']).toBe(undefined);
    });
    it('should not change forwardAnimation and previousFilterCriteriaCount if passed value is null', () => {
      component.filterCriteria = null;
      fixture.detectChanges();
      expect(component.forwardAnimation).toBe(true);
      expect(component['previousFilterCriteriaCount']).toBe(undefined);
    });
    it('should update forwardAnimation to false and previousFilterCriteriaCount to the count if the first value is passed', () => {
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      expect(component.forwardAnimation).toBe(false);
      expect(component['previousFilterCriteriaCount']).toBe(
        mockFilterCriteria.length
      );
    });
    it('should update forwardAnimation to true and previousFilterCriteriaCount to the new count if a new value is passed that has a bigger length', () => {
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      component.filterCriteria = [...mockFilterCriteria, ...mockFilterCriteria];
      fixture.detectChanges();
      expect(component.forwardAnimation).toBe(true);
      expect(component['previousFilterCriteriaCount']).toBe(
        mockFilterCriteria.length * 2
      );
    });
    it('should update forwardAnimation to false and previousFilterCriteriaCount to the new count if a new value is passed that has a lower length', () => {
      component.filterCriteria = [...mockFilterCriteria, ...mockFilterCriteria];
      fixture.detectChanges();
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      expect(component.forwardAnimation).toBe(false);
      expect(component['previousFilterCriteriaCount']).toBe(
        mockFilterCriteria.length
      );
    });
  });
  describe('columnVisible', () => {
    it('should return true only for the last column if new criteria are passed and preserveColumn is false', () => {
      component.filterCriteria = [...mockFilterCriteria, ...mockFilterCriteria];
      fixture.detectChanges();
      const expectedReturnValues = [false, false, false, true];
      expectedReturnValues.forEach((expectedReturnValue, index) => {
        expect(component.columnVisible(index)).toBe(expectedReturnValue);
      });
    });
    it('should return true only for the second to last column if new criteria are passed and preserveColumn is true', () => {
      component.preserveColumn = true;
      component.filterCriteria = [...mockFilterCriteria, ...mockFilterCriteria];
      fixture.detectChanges();
      const expectedReturnValues = [false, false, true, false];
      expectedReturnValues.forEach((expectedReturnValue, index) => {
        expect(component.columnVisible(index)).toBe(expectedReturnValue);
      });
    });
  });
  describe('animationState', () => {
    it(`should return correct 'backward' string values when criteria are passed for the first time`, () => {
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      const expectedReturnValues = ['backwardLeave', 'backwardEnter'];
      expectedReturnValues.forEach((expectedReturnValue, index) => {
        expect(component.animationState(index)).toBe(expectedReturnValue);
      });
    });
    it(`should return correct 'forward' string values when criteria are passed for the second time that have a bigger length`, () => {
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      component.filterCriteria = [...mockFilterCriteria, ...mockFilterCriteria];
      fixture.detectChanges();
      const expectedReturnValues = [
        'forwardLeave',
        'forwardLeave',
        'forwardLeave',
        'forwardEnter'
      ];
      expectedReturnValues.forEach((expectedReturnValue, index) => {
        expect(component.animationState(index)).toBe(expectedReturnValue);
      });
    });
  });
  describe('onFilterSelectionChange', () => {
    it(`should set the new 'preserveColumn' value (false to true)`, () => {
      component.filterCriteria = mockFilterCriteria;
      expect(component.preserveColumn).toBe(false);
      component.onFilterSelectionChange(
        new SearchFilterCriteriaValuesFixture(),
        true
      );
      expect(component.preserveColumn).toBe(true);
    });
    it(`should set the new 'preserveColumn' value (true to false)`, () => {
      component.filterCriteria = mockFilterCriteria;
      component.preserveColumn = true;
      fixture.detectChanges();
      expect(component.preserveColumn).toBe(true);
      component.onFilterSelectionChange(
        new SearchFilterCriteriaValuesFixture(),
        false
      );
      expect(component.preserveColumn).toBe(false);
    });
    it('should reset all the selected values to false exept the value that is passed', () => {
      const selectedTrueMockFilterCriteria: SearchFilterCriteriaInterface[] = [
        new SearchFilterCriteriaFixture({}, [
          new SearchFilterCriteriaValuesFixture({ selected: true }),
          new SearchFilterCriteriaValuesFixture({ selected: true }),
          new SearchFilterCriteriaValuesFixture({ selected: true }),
          new SearchFilterCriteriaValuesFixture({ selected: true })
        ]),
        new SearchFilterCriteriaFixture({}, [
          new SearchFilterCriteriaValuesFixture({ selected: true }),
          new SearchFilterCriteriaValuesFixture({ selected: true }),
          new SearchFilterCriteriaValuesFixture({ selected: true }),
          new SearchFilterCriteriaValuesFixture({ selected: true })
        ])
      ];
      component.filterCriteria = selectedTrueMockFilterCriteria;
      fixture.detectChanges();
      const passedCIndex = 0;
      const passedVIndex = 2;
      component.onFilterSelectionChange(
        component.filterCriteria[passedCIndex].values[passedVIndex],
        false
      );
      selectedTrueMockFilterCriteria.forEach((mockFilterCriterium, cIndex) => {
        mockFilterCriterium.values.forEach((value, vIndex) => {
          expect(value.selected).toBe(
            cIndex === passedCIndex && vIndex === passedVIndex ? true : false
          );
        });
      });
    });
    it('should call the emit on the filterSelectionChange output', () => {
      const emitSpy = jest.spyOn(component.filterSelectionChange, 'emit');
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      component.onFilterSelectionChange(
        new SearchFilterCriteriaValuesFixture(),
        false
      );
      expect(emitSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('view', () => {
    it('should show only one column', () => {
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      const displayedColumns = fixture.debugElement
        .queryAll(By.css('.column'))
        .filter(column => column.nativeElement.style.display !== 'none');
      expect(displayedColumns.length).toBe(1);
    });
    it('should show the correct amount of values', () => {
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      const displayedColumns = fixture.debugElement
        .queryAll(By.css('.column'))
        .filter(column => column.nativeElement.style.display !== 'none');
      const displayedValues = displayedColumns[0].queryAll(By.css('.value'));
      expect(displayedValues.length).toBe(7);
    });
    it('should show the magnifier and the arrow only if value.prediction is set and not 0', () => {
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      const displayedColumns = fixture.debugElement
        .queryAll(By.css('.column'))
        .filter(column => column.nativeElement.style.display !== 'none');
      const displayedArrows = displayedColumns[0].queryAll(By.css('.arrow'));
      const displayedMagnifiers = displayedColumns[0].queryAll(
        By.css('.magnifier')
      );
      expect(displayedArrows.length).toBe(4);
      expect(displayedMagnifiers.length).toBe(4);
    });
    it('should show or hide the no-criteria message if there are criteria or no criteria', () => {
      expect(fixture.debugElement.query(By.css('.no-criteria'))).toBeTruthy();
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.no-criteria'))).toBeFalsy();
    });
  });
});

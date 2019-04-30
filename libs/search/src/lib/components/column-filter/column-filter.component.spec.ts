import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconModule,
  MatIconRegistry,
  MatListModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
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
      data: { id: 1, name: 'one' },
      selected: false,
      prediction: undefined
    }),
    new SearchFilterCriteriaValuesFixture({
      data: { id: 1, name: 'two' },
      selected: false,
      prediction: null
    }),
    new SearchFilterCriteriaValuesFixture({
      data: { id: 1, name: 'three' },
      selected: false,
      prediction: 0
    }),
    new SearchFilterCriteriaValuesFixture({
      data: { id: 1, name: 'four' },
      selected: false
    }),
    new SearchFilterCriteriaValuesFixture({
      data: { id: 1, name: 'five' },
      selected: false
    }),
    new SearchFilterCriteriaValuesFixture({
      data: { id: 1, name: 'six' },
      selected: false
    }),
    new SearchFilterCriteriaValuesFixture({
      data: { id: 1, name: 'seven' },
      selected: false,
      hasChild: true
    })
  ])
];

describe('ColumnFilterComponent', () => {
  let component: ColumnFilterComponent;
  let fixture: ComponentFixture<ColumnFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColumnFilterComponent],
      imports: [MatListModule, NoopAnimationsModule, MatIconModule],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    });
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
    it('should update forwardAnimation to false and visibleColumnIndex to the new count if a new value is passed that has a bigger length', () => {
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      component.filterCriteria = [...mockFilterCriteria, ...mockFilterCriteria];
      fixture.detectChanges();
      expect(component['forwardAnimation']).toBe(false);
      expect(component['columnFilterService'].visibleColumnIndex).toBe(
        mockFilterCriteria.length * 2 - 1
      );
    });
    it('should update forwardAnimation to true and visibleColumnIndex to the new count if a new value is passed that has a lower length', () => {
      component.filterCriteria = [...mockFilterCriteria, ...mockFilterCriteria];
      fixture.detectChanges();
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      expect(component['forwardAnimation']).toBe(true);
      expect(component['columnFilterService'].visibleColumnIndex).toBe(
        mockFilterCriteria.length - 1
      );
    });
  });
  describe('animationState', () => {
    it(`should return correct 'backward' string value when criteria are passed for the first time`, () => {
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      expect(component.animationState()).toBe('backwardEnter');
    });
    it(`should return correct 'backward' string value when criteria are passed for the second time that have a bigger length`, () => {
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      component.filterCriteria = [...mockFilterCriteria, ...mockFilterCriteria];
      fixture.detectChanges();
      expect(component.animationState()).toBe('backwardEnter');
    });
    it(`should return correct 'forward' string value when criteria are passed for the second time that have a lower length`, () => {
      component.filterCriteria = [...mockFilterCriteria, ...mockFilterCriteria];
      fixture.detectChanges();
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      expect(component.animationState()).toBe('forwardEnter');
    });
    it(`should return correct 'noAnimation' string value when preserveColumn === true`, () => {
      component.filterCriteria = [...mockFilterCriteria];
      fixture.detectChanges();
      component['columnFilterService'].preserveColumn = true;
      component.filterCriteria = [...mockFilterCriteria];
      fixture.detectChanges();
      expect(component.animationState()).toBe('noAnimation');
    });
  });
  describe('onFilterSelectionChange', () => {
    it(`should set the new 'preserveColumn' value (false to true)`, () => {
      component.filterCriteria = mockFilterCriteria;
      expect(component['columnFilterService'].preserveColumn).toBe(false);
      component.onFilterSelectionChange(
        new SearchFilterCriteriaValuesFixture(),
        true,
        mockFilterCriteria[0].name
      );
      expect(component['columnFilterService'].preserveColumn).toBe(true);
    });
    it(`should set the new 'preserveColumn' value (true to false)`, () => {
      component.filterCriteria = mockFilterCriteria;
      component['columnFilterService'].preserveColumn = true;
      fixture.detectChanges();
      expect(component['columnFilterService'].preserveColumn).toBe(true);
      component.onFilterSelectionChange(
        new SearchFilterCriteriaValuesFixture(),
        false,
        mockFilterCriteria[0].name
      );
      expect(component['columnFilterService'].preserveColumn).toBe(false);
    });
    it('should reset all the selected values to false exept the value that is passed', () => {
      const selectedTrueMockFilterCriteria: SearchFilterCriteriaInterface[] = [
        new SearchFilterCriteriaFixture({}, [
          new SearchFilterCriteriaValuesFixture({ selected: true }),
          new SearchFilterCriteriaValuesFixture({ selected: true }),
          new SearchFilterCriteriaValuesFixture({ selected: true }),
          new SearchFilterCriteriaValuesFixture({ selected: true })
        ]),
        new SearchFilterCriteriaFixture({ name: 'filterCriteriumToChange' }, [
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
        false,
        component.filterCriteria[passedCIndex].name
      );
      selectedTrueMockFilterCriteria.forEach((mockFilterCriterium, cIndex) => {
        mockFilterCriterium.values.forEach((value, vIndex) => {
          const expected =
            cIndex !== selectedTrueMockFilterCriteria.length - 1
              ? value.selected // the values that are not in the last criteria should not be changed so we just check the original here
              : (cIndex === passedCIndex && vIndex === passedVIndex) || // changed criterion and changed value
                cIndex !== passedCIndex;
          // other criterion

          expect(value.selected).toBe(expected);
        });
      });
    });
    it('should call the emit on the filterSelectionChange output if the selection changed', () => {
      const emitSpy = jest.spyOn(component.filterSelectionChange, 'emit');
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      component.onFilterSelectionChange(
        new SearchFilterCriteriaValuesFixture({ selected: false }),
        false,
        mockFilterCriteria[0].name
      );
      expect(emitSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledTimes(1);
    });
    it('should not call the emit on the filterSelectionChange output if the selection is unchanged', () => {
      const emitSpy = jest.spyOn(component.filterSelectionChange, 'emit');
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      component.onFilterSelectionChange(
        new SearchFilterCriteriaValuesFixture({ selected: true }),
        false,
        mockFilterCriteria[0].name
      );
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
  describe('view', () => {
    it('should show the correct amount of values', () => {
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      const displayedColumns = fixture.debugElement.queryAll(
        By.css('.column__filter')
      );
      const displayedValues = displayedColumns[1].queryAll(
        By.css('.column__filter__value')
      );
      expect(displayedValues.length).toBe(7);
    });
    it('should show the correct content in the labels', () => {
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      const displayedColumns = fixture.debugElement.queryAll(
        By.css('.column__filter')
      );
      const displayedLabels = displayedColumns[1].queryAll(
        By.css('.column__filter__value__button-content__label')
      );
      expect(displayedLabels.length).toBe(7);
      ['one', 'two', 'three', 'four', 'five', 'six', 'seven'].forEach(
        (expectedLabel, i) => {
          expect(displayedLabels[i].nativeElement.textContent.trim()).toBe(
            expectedLabel
          );
        }
      );
    });
    it('should show the magnifier only if value.prediction is set and not 0', () => {
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      const displayedColumns = fixture.debugElement.queryAll(
        By.css('.column__filter')
      );
      const displayedMagnifiers = displayedColumns[1].queryAll(
        By.css('.column__filter__value__button-content__icons__magnifier')
      );
      expect(displayedMagnifiers.length).toBe(4);
    });
    it('should show the arrow only if value.hasChild is true', () => {
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      const displayedColumns = fixture.debugElement.queryAll(
        By.css('.column__filter')
      );
      const displayedMagnifiers = displayedColumns[1].queryAll(
        By.css('.column__filter__value__button-content__icons__arrow')
      );
      expect(displayedMagnifiers.length).toBe(1);
    });
    it('should show or hide the no-criteria message if there are criteria or no criteria', () => {
      expect(
        fixture.debugElement.query(By.css('.column__filter--no-criteria'))
      ).toBeTruthy();
      component.filterCriteria = mockFilterCriteria;
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('.column__filter--no-criteria'))
      ).toBeFalsy();
    });
  });
});

import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatBadge,
  MatBadgeModule,
  MatSelect,
  MatSelectModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from '../../+fixtures/search-filter-criteria.fixture';
import { SearchFilterCriteriaInterface } from '../../interfaces';
import { DateFilterComponent } from './date-filter.component';

describe('DateFilterComponent', () => {
  let component: DateFilterComponent;
  let fixture: ComponentFixture<DateFilterComponent>;
  let matSelect: DebugElement;
  let matSelectComponent: MatSelect;
  let matBadge: DebugElement;
  let mockFilterCriteria: SearchFilterCriteriaInterface;
  let multiSelect: boolean;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSelectModule,
        ReactiveFormsModule,
        MatBadgeModule,
        NoopAnimationsModule
      ],
      declarations: [DateFilterComponent]
    });

    mockFilterCriteria = new SearchFilterCriteriaFixture({}, [
      new SearchFilterCriteriaValuesFixture({
        data: {
          id: 1,
          name: 'foo'
        }
      }),
      new SearchFilterCriteriaValuesFixture({
        data: {
          id: 2,
          name: 'bar'
        }
      }),
      new SearchFilterCriteriaValuesFixture({
        data: {
          id: 3,
          name: 'foobar'
        }
      })
    ]);
    // cannot change multiple after component initialization
    multiSelect = true;

    fixture = TestBed.createComponent(DateFilterComponent);
    component = fixture.componentInstance;
    component.multiple = multiSelect;
    component.filterCriteria = mockFilterCriteria;

    matSelect = fixture.debugElement.query(By.directive(MatSelect));
    matSelectComponent = matSelect.componentInstance as MatSelect;
    matBadge = fixture.debugElement.query(By.directive(MatBadge));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add options to the select component', () => {
    const options = getOptionsForCriteria();
    expect(options.length).toBe(mockFilterCriteria.values.length);
  });

  it('should not display options where visible is falsy', () => {
    mockFilterCriteria.values[0].visible = false;
    const options = getOptionsForCriteria();
    expect(options.length).toBe(mockFilterCriteria.values.length - 1);
  });

  it('should display prediction numbers', () => {
    mockFilterCriteria.values[0].prediction = 2;
    mockFilterCriteria.values[1].prediction = 4;
    mockFilterCriteria.values[2].prediction = 6;
    const options = getOptionsForCriteria();
    expect(options[0].nativeElement.textContent).toContain('(2)');
    expect(options[1].nativeElement.textContent).toContain('(4)');
    expect(options[2].nativeElement.textContent).toContain('(6)');
  });

  it('should display count-badge when one or more items are selected', () => {
    // empty selection > hidden
    expect(matSelect.nativeElement.className).toContain('mat-badge-hidden');

    // active selection > visible
    mockFilterCriteria.values[0].selected = true;
    mockFilterCriteria.values[1].selected = true;
    component.filterCriteria = mockFilterCriteria;
    fixture.detectChanges();
    expect(matSelect.nativeElement.className).not.toContain('mat-badge-hidden');
    expect(matBadge.nativeElement.textContent).toContain(2);
  });

  it('should add reset option to the select component', () => {
    component.resetLabel = 'resetFoo';
    const options = getOptionsForCriteria();
    expect(options.length).toBe(4);
    expect(options[0].nativeElement.textContent).toContain('resetFoo');
  });

  it('should reset the selected options when clicked', done => {
    mockFilterCriteria.values[0].selected = true;
    component.filterCriteria = mockFilterCriteria;
    component.resetLabel = 'resetFoo';
    fixture.detectChanges();

    const expected = [
      new SearchFilterCriteriaFixture({}, [
        new SearchFilterCriteriaValuesFixture({
          data: {
            id: 1,
            name: 'foo'
          },
          selected: false
        }),
        new SearchFilterCriteriaValuesFixture({
          data: {
            id: 2,
            name: 'bar'
          },
          selected: false
        }),
        new SearchFilterCriteriaValuesFixture({
          data: {
            id: 3,
            name: 'foobar'
          },
          selected: false
        })
      ])
    ];
    const options = getOptionsForCriteria();

    component.filterSelectionChange.subscribe(selection => {
      expect(selection).toEqual(expected);
      done();
    });

    options[0].nativeElement.click();
  });

  it('should have [multiple] option active for the select component', () => {
    // cannot change multiple after component initialization, but set as true at the start of the test
    expect(matSelectComponent.multiple).toBe(true);
  });

  it('should output the updated searchFilterCriteria on change', done => {
    const expected = [
      new SearchFilterCriteriaFixture({}, [
        new SearchFilterCriteriaValuesFixture({
          data: {
            id: 1,
            name: 'foo'
          },
          selected: true
        }),
        new SearchFilterCriteriaValuesFixture({
          data: {
            id: 2,
            name: 'bar'
          },
          selected: true
        }),
        new SearchFilterCriteriaValuesFixture({
          data: {
            id: 3,
            name: 'foobar'
          }
        })
      ])
    ];

    component.filterSelectionChange.subscribe(selection => {
      expect(selection).toEqual(expected);
      done();
    });
    // select first two elements
    component.selectControl.setValue(mockFilterCriteria.values.slice(0, 2));
  });

  function getOptionsForCriteria(
    criteria: SearchFilterCriteriaInterface = mockFilterCriteria
  ): DebugElement[] {
    component.filterCriteria = criteria;
    matSelectComponent.open();
    fixture.detectChanges();
    return fixture.debugElement.queryAll(By.css('mat-option'));
  }
});

import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatBadge,
  MatButtonToggleGroup,
  MatButtonToggleModule,
  MatSelect
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from '../../+fixtures/search-filter-criteria.fixture';
import { SearchFilterCriteriaInterface } from '../../interfaces';
import { ButtonToggleFilterComponent } from './button-toggle-filter.component';

describe('ButtonToggleFilterComponent', () => {
  let component: ButtonToggleFilterComponent;
  let fixture: ComponentFixture<ButtonToggleFilterComponent>;
  let matButtonToggleGroup: DebugElement;
  let matButtonToggleGroupComponent: MatButtonToggleGroup;
  let matBadge: DebugElement;
  let mockFilterCriteria: SearchFilterCriteriaInterface;
  let multiSelect: boolean;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonToggleModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [ButtonToggleFilterComponent]
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

    fixture = TestBed.createComponent(ButtonToggleFilterComponent);
    component = fixture.componentInstance;
    component.multiple = multiSelect;
    component.filterCriteria = mockFilterCriteria;

    matButtonToggleGroup = fixture.debugElement.query(By.directive(MatSelect));
    matButtonToggleGroupComponent = matButtonToggleGroup.componentInstance as MatButtonToggleGroup;
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

  it('should have [multiple] option active for the select component', () => {
    // cannot change multiple after component initialization, but set as true at the start of the test
    expect(matButtonToggleGroupComponent.multiple).toBe(true);
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
    component.toggleControl.setValue(mockFilterCriteria.values.slice(0, 2));
  });

  function getOptionsForCriteria(
    criteria: SearchFilterCriteriaInterface = mockFilterCriteria
  ): DebugElement[] {
    component.filterCriteria = criteria;
    // matButtonToggleGroupComponent.open();
    fixture.detectChanges();
    return fixture.debugElement.queryAll(By.css('mat-option'));
  }
});

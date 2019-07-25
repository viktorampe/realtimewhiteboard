import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
  MatButtonToggleModule,
  MatIconModule,
  MatIconRegistry,
  MatTooltipModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
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
  let mockFilterCriteria: SearchFilterCriteriaInterface;
  let multiSelect: boolean;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonToggleModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatTooltipModule,
        MatIconModule
      ],
      declarations: [ButtonToggleFilterComponent],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
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

    matButtonToggleGroup = fixture.debugElement.query(
      By.directive(MatButtonToggleGroup)
    );
    matButtonToggleGroupComponent = matButtonToggleGroup.componentInstance as MatButtonToggleGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add buttons to the toggleGroup component', () => {
    const buttons = getButtonsForCriteria();
    expect(buttons.length).toBe(mockFilterCriteria.values.length);
  });

  it('should not display buttons where visible is falsy', () => {
    mockFilterCriteria.values[0].visible = false;
    const buttons = getButtonsForCriteria();
    expect(buttons.length).toBe(mockFilterCriteria.values.length - 1);
  });

  it('should display prediction numbers in the tooltip', () => {
    mockFilterCriteria.values[0].prediction = 0;
    mockFilterCriteria.values[1].prediction = 1;
    mockFilterCriteria.values[2].prediction = 6;
    const buttons = getButtonsForCriteria();
    const tooltips = buttons.map(
      option => option.nativeElement.attributes['ng-reflect-message'].value
    );

    expect(tooltips[0]).toBe('');
    expect(tooltips[1]).toBe('1 resultaat');
    expect(tooltips[2]).toBe('6 resultaten');
  });

  it('should have [multiple] option active for the toggleGroup component', () => {
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
    // toggleGroup first two elements
    component.toggleControl.setValue(mockFilterCriteria.values.slice(0, 2));
  });

  it('should disable a button when there are 0 predictions', () => {
    mockFilterCriteria.values[0].prediction = 0;
    mockFilterCriteria.values[1].prediction = 1;
    mockFilterCriteria.values[2].prediction = undefined;
    const buttons = getButtonsForCriteria();
    const buttonComponents = buttons.map(
      button => button.componentInstance as MatButtonToggle
    );

    expect(buttonComponents[0].disabled).toBe(true);
    expect(buttonComponents[1].disabled).toBe(false);
    expect(buttonComponents[2].disabled).toBe(false);
  });

  function getButtonsForCriteria(
    criteria: SearchFilterCriteriaInterface = mockFilterCriteria
  ): DebugElement[] {
    component.filterCriteria = criteria;
    fixture.detectChanges();
    return fixture.debugElement.queryAll(By.css('mat-button-toggle'));
  }
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatListModule,
  MatListOption,
  MatSelectionList,
  MatSelectionListChange
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CredentialFixture, LearningAreaFixture } from '@campus/dal';
import { SearchFilterCriteriaInterface } from '../../interfaces';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from './../../+fixtures/search-filter-criteria.fixture';
import { CheckboxListFilterComponent } from './checkbox-list-filter.component';
import { CheckboxSelectionListFilterComponent } from './checkbox-selection-list-filter/checkbox-selection-list-filter.component';

describe('CheckboxListFilterComponentComponent', () => {
  let component: CheckboxListFilterComponent;
  let fixture: ComponentFixture<CheckboxListFilterComponent>;
  let mockFilterCriteria: SearchFilterCriteriaInterface;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatListModule, NoopAnimationsModule],
      declarations: [
        CheckboxListFilterComponent,
        CheckboxSelectionListFilterComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxListFilterComponent);
    component = fixture.componentInstance;

    mockFilterCriteria = new SearchFilterCriteriaFixture(
      { label: 'search filter' },
      [
        new SearchFilterCriteriaValuesFixture(
          {
            data: new LearningAreaFixture({
              id: 1,
              name: 'Aardrijkskunde'
            })
          },
          new SearchFilterCriteriaFixture(
            { keyProperty: 'id', displayProperty: 'provider' },
            [
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 1, provider: 'smartschool' })
              }),
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 2, provider: 'google' })
              }),
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 3, provider: 'facebook' })
              })
            ]
          )
        ),
        new SearchFilterCriteriaValuesFixture(
          {
            data: new LearningAreaFixture({
              id: 2,
              name: 'Geschiedenis'
            })
          },
          new SearchFilterCriteriaFixture(
            { keyProperty: 'id', displayProperty: 'provider' },
            [
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 1, provider: 'smartschool' })
              }),
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 2, provider: 'google' })
              }),
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 3, provider: 'facebook' })
              })
            ]
          )
        ),
        new SearchFilterCriteriaValuesFixture(
          {
            data: new LearningAreaFixture({
              id: 3,
              name: 'Wiskunde'
            })
          },
          new SearchFilterCriteriaFixture(
            { keyProperty: 'id', displayProperty: 'provider' },
            [
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 1, provider: 'smartschool' })
              }),
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 2, provider: 'google' })
              }),
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 3, provider: 'facebook' })
              })
            ]
          )
        ),
        new SearchFilterCriteriaValuesFixture({
          data: new LearningAreaFixture({
            id: 4,
            name: 'Informatica'
          })
        }),
        new SearchFilterCriteriaValuesFixture({
          data: new LearningAreaFixture({
            id: 5,
            name: 'Engels'
          })
        })
      ]
    );

    component.filterCriteria = mockFilterCriteria;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('output', () => {
    it('should emit the updated filtercriterium when the mat-selection-list selection changed', () => {
      spyOn(component.filterSelectionChange, 'emit');

      const matListComp: MatSelectionList = fixture.debugElement.query(
        By.css('mat-selection-list')
      ).componentInstance;

      const selectedOption: MatListOption = new MatListOption(
        null,
        fixture.changeDetectorRef,
        matListComp
      );
      selectedOption.value = mockFilterCriteria.values[0];

      matListComp.selectedOptions.select(selectedOption);

      const mockEvent = new MatSelectionListChange(matListComp, selectedOption);

      const expected = {
        ...mockFilterCriteria,
        ...{ values: mockFilterCriteria.values.map(value => ({ ...value })) }
      };
      expected.values[0].selected = true;

      matListComp.selectionChange.next(mockEvent);

      expect(component.filterSelectionChange.emit).toHaveBeenCalled();
      expect(component.filterSelectionChange.emit).toHaveBeenCalledTimes(1);
      expect(component.filterSelectionChange.emit).toHaveBeenCalledWith([
        expected
      ]);
    });
  });

  describe('filtering and sorting', () => {
    it('should filter out values that are not visible', () => {
      // doublecheck no values are filtered out at the moment
      expect(component.filteredFilterCriteria.values).toEqual(
        mockFilterCriteria.values
      );

      const changedFilterCriterium = { ...mockFilterCriteria };
      changedFilterCriterium.values[4].visible = false;
      component.filterCriteria = changedFilterCriterium; // trigger setter

      expect(component.filteredFilterCriteria.values).not.toContain(
        component.filterCriteria.values[4]
      );
    });

    it('should sort selected values to the front of the values-array', () => {
      // doublecheck values[4] isn't first on init
      expect(component.filteredFilterCriteria.values[0]).not.toBe(
        component.filterCriteria.values[4]
      );

      const changedFilterCriterium = { ...mockFilterCriteria };
      changedFilterCriterium.values[4].selected = true;
      component.filterCriteria = changedFilterCriterium; // trigger setter

      expect(component.filteredFilterCriteria.values[0]).toBe(
        component.filterCriteria.values[4]
      );
    });
  });
});

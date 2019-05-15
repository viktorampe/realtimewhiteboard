import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatIconModule,
  MatListModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFilterCriteriaInterface } from '../../interfaces';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from './../../+fixtures/search-filter-criteria.fixture';
import { CheckboxFilterComponent } from './checkbox-filter/checkbox-filter.component';
import { CheckboxListFilterComponent } from './checkbox-list-filter.component';

describe('CheckboxListFilterComponentComponent', () => {
  let component: CheckboxListFilterComponent;
  let fixture: ComponentFixture<CheckboxListFilterComponent>;
  let mockFilterCriteria: SearchFilterCriteriaInterface;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatListModule,
        NoopAnimationsModule,
        MatCheckboxModule,
        MatIconModule,
        FormsModule
      ],
      declarations: [CheckboxListFilterComponent, CheckboxFilterComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxListFilterComponent);
    component = fixture.componentInstance;

    mockFilterCriteria = new SearchFilterCriteriaFixture(
      { label: 'search filter' },
      [
        new SearchFilterCriteriaValuesFixture(
          {
            data: {
              id: 1,
              name: 'Aardrijkskunde'
            }
          },
          new SearchFilterCriteriaFixture(
            { keyProperty: 'id', displayProperty: 'provider' },
            [
              new SearchFilterCriteriaValuesFixture({
                data: { id: 1, provider: 'smartschool' }
              }),
              new SearchFilterCriteriaValuesFixture({
                data: { id: 2, provider: 'google' }
              }),
              new SearchFilterCriteriaValuesFixture({
                data: { id: 3, provider: 'facebook' }
              })
            ]
          )
        ),
        new SearchFilterCriteriaValuesFixture(
          {
            data: {
              id: 2,
              name: 'Geschiedenis'
            }
          },
          new SearchFilterCriteriaFixture(
            { keyProperty: 'id', displayProperty: 'provider' },
            [
              new SearchFilterCriteriaValuesFixture({
                data: { id: 1, provider: 'smartschool' }
              }),
              new SearchFilterCriteriaValuesFixture({
                data: { id: 2, provider: 'google' }
              }),
              new SearchFilterCriteriaValuesFixture({
                data: { id: 3, provider: 'facebook' }
              })
            ]
          )
        ),
        new SearchFilterCriteriaValuesFixture(
          {
            data: {
              id: 3,
              name: 'Wiskunde'
            }
          },
          new SearchFilterCriteriaFixture(
            { keyProperty: 'id', displayProperty: 'provider' },
            [
              new SearchFilterCriteriaValuesFixture({
                data: { id: 1, provider: 'smartschool' }
              }),
              new SearchFilterCriteriaValuesFixture({
                data: { id: 2, provider: 'google' }
              }),
              new SearchFilterCriteriaValuesFixture({
                data: { id: 3, provider: 'facebook' }
              })
            ]
          )
        ),
        new SearchFilterCriteriaValuesFixture({
          data: {
            id: 4,
            name: 'Informatica'
          }
        }),
        new SearchFilterCriteriaValuesFixture({
          data: {
            id: 5,
            name: 'Engels'
          }
        })
      ]
    );

    component.filterCriteria = mockFilterCriteria;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('predictions', () => {
    it('should display the component if there are predictions', () => {
      component.hasPredictions = true;
      fixture.detectChanges();

      const title = fixture.debugElement.query(
        By.css('.checkbox__list__filter__title')
      );
      const list = fixture.debugElement.query(
        By.css('.checkbox__list__filter__list')
      );

      expect(title).toBeTruthy();
      expect(list).toBeTruthy();
    });

    it('should hide the component if there are no predictions', () => {
      component.hasPredictions = false;
      fixture.detectChanges();

      const title = fixture.debugElement.query(
        By.css('.checkbox__list__filter__title')
      );
      const list = fixture.debugElement.query(
        By.css('.checkbox__list__filter__list')
      );

      expect(title).toBeFalsy();
      expect(list).toBeFalsy();
    });

    it('should display title when child value is selected', () => {
      component.filterCriteria = {
        displayProperty: 'label',
        keyProperty: 'id',
        name: 'foo',
        label: 'foo',
        values: [
          {
            data: { id: 1 },
            child: {
              displayProperty: 'label',
              keyProperty: 'id',
              values: [
                {
                  data: { id: 2 },
                  selected: true
                }
              ]
            } as SearchFilterCriteriaInterface
          }
        ]
      };

      component.ngOnInit();

      expect(component.hasPredictions).toBe(true);
    });

    it('should display title when a value is selected', () => {
      component.filterCriteria = {
        displayProperty: 'label',
        keyProperty: 'id',
        name: 'foo',
        label: 'foo',
        values: [
          {
            selected: true,
            data: { id: 1 }
          }
        ]
      };

      component.ngOnInit();

      expect(component.hasPredictions).toBe(true);
    });
  });

  describe('output', () => {
    it('should emit the updated filtercriterium when the childcomponent emits', fakeAsync(() => {
      spyOn(component.filterSelectionChange, 'emit');

      const child: CheckboxFilterComponent = fixture.debugElement.query(
        By.directive(CheckboxFilterComponent)
      ).componentInstance;

      const expected = {
        ...mockFilterCriteria,
        ...{ values: mockFilterCriteria.values.map(value => ({ ...value })) }
      };
      expected.values[0].selected = true;

      child.criterium.values[0].selected = true;
      child.selectionChanged.next();

      tick();

      expect(component.filterSelectionChange.emit).toHaveBeenCalled();
      expect(component.filterSelectionChange.emit).toHaveBeenCalledTimes(1);
      expect(component.filterSelectionChange.emit).toHaveBeenCalledWith([
        expected
      ]);
    }));
  });
});

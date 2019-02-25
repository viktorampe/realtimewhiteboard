import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckbox, MatCheckboxModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { CredentialFixture, LearningAreaFixture } from '@campus/dal';
import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from '../../interfaces';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from './../../+fixtures/search-filter-criteria.fixture';
import { CheckboxLineFilterComponent } from './checkbox-line-filter-component';

describe('CheckboxLineFilterComponent', () => {
  let component: CheckboxLineFilterComponent;
  let fixture: ComponentFixture<CheckboxLineFilterComponent>;
  let mockFilterCriteria: SearchFilterCriteriaInterface;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxLineFilterComponent],
      imports: [MatCheckboxModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxLineFilterComponent);
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
          }),
          visible: false
        }),
        new SearchFilterCriteriaValuesFixture({
          data: new LearningAreaFixture({
            id: 5,
            name: 'Engels'
          }),
          prediction: 0
        })
      ]
    );

    component.filterCriteria = mockFilterCriteria;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have this correct number of items', () => {
    const checkboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
    expect(checkboxes.length).toBe(4);
  });

  it('should have this correct number of disabled items', () => {
    const checkboxes = fixture.debugElement.queryAll(
      By.css('.mat-checkbox-disabled')
    );
    expect(checkboxes.length).toBe(1);
  });

  it('should emit the updated filtercriterium the selection changes', () => {
    spyOn(component.filterSelectionChange, 'emit');
    const checkbox: MatCheckbox = fixture.debugElement.query(
      By.css('mat-checkbox')
    ).componentInstance;
    component.itemChanged(
      // mat-checkbox value is typed as string, by default
      (checkbox.value as unknown) as SearchFilterCriteriaValuesInterface
    );

    const expected = {
      ...component.filterCriteria,
      ...{
        values: component.filterCriteria.values.map(value => ({ ...value }))
      }
    };
    expected.values[0].selected = true;

    expect(component.filterSelectionChange.emit).toHaveBeenCalled();
    expect(component.filterSelectionChange.emit).toHaveBeenCalledTimes(1);
    expect(component.filterSelectionChange.emit).toHaveBeenCalledWith([
      expected
    ]);
  });
});

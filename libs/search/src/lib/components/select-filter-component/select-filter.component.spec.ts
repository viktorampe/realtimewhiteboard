import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule, MatSelectModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from '../../+fixtures/search-filter-criteria.fixture';
import { SelectFilterComponent } from './select-filter.component';

describe('SelectFilterComponentComponent', () => {
  let component: SelectFilterComponent;
  let fixture: ComponentFixture<SelectFilterComponent>;
  const mockFilterCriteria = new SearchFilterCriteriaFixture({}, [
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
    })
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatSelectModule, ReactiveFormsModule, MatBadgeModule],
      declarations: [SelectFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.filterCriteria = mockFilterCriteria;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add options to the select component', () => {
    // set filterCriteria, check MatOptions
    const options = fixture.debugElement.queryAll(By.css('mat-option'));

    expect(options.length).toBe(2);
  });

  it('should not display options where visible is falsy', () => {
    mockFilterCriteria.values[0].visible = false;
    fixture.detectChanges();
  });

  it('should display prediction numbers', () => {
    //
  });

  it('should display count-badge when one or more items are selected', () => {
    //
  });

  it('should add reset option to the select component', () => {
    // set filterCriteria and resetlabel inputs, check MatOptions
  });

  it('should add [multiple] option the select component', () => {
    // set filterCriteria and multiple inputs, check MatSelect multiple attribute
  });

  it('should output the updated searchFilterCriteria on change', () => {
    //
  });
});

// file.only

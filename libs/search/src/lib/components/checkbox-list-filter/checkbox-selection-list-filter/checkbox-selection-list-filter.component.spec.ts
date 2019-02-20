import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { CredentialFixture, LearningAreaFixture } from '@campus/dal';
import { CheckboxListFilterComponent } from '../checkbox-list-filter.component';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from './../../../+fixtures/search-filter-criteria.fixture';
import { CheckboxSelectionListFilterComponent } from './checkbox-selection-list-filter.component';

describe('CheckboxSelectionListFilterComponent', () => {
  let component: CheckboxSelectionListFilterComponent;
  let componentDE: DebugElement;
  let fixture: ComponentFixture<CheckboxListFilterComponent>;
  let mockFilterCriteria;
  let mockChildFilterCriteria;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatListModule],
      declarations: [
        CheckboxSelectionListFilterComponent,
        CheckboxListFilterComponent
      ],
      providers: [CheckboxListFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    // create parent element as fixture
    fixture = TestBed.createComponent(CheckboxListFilterComponent);

    mockChildFilterCriteria = new SearchFilterCriteriaFixture(
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
    );

    // by default without children
    mockFilterCriteria = new SearchFilterCriteriaFixture(
      { label: 'search filter' },
      [
        new SearchFilterCriteriaValuesFixture({
          data: new LearningAreaFixture({
            id: 1,
            name: 'Aardrijkskunde'
          })
        }),
        new SearchFilterCriteriaValuesFixture({
          data: new LearningAreaFixture({
            id: 2,
            name: 'Geschiedenis'
          })
        }),
        new SearchFilterCriteriaValuesFixture({
          data: new LearningAreaFixture({
            id: 3,
            name: 'Wiskunde'
          })
        }),
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

    fixture.componentInstance.filterCriteria = mockFilterCriteria;
    fixture.detectChanges();

    componentDE = fixture.debugElement.query(
      By.css('campus-checkbox-selection-list-filter')
    );
    component = componentDE.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('maxVisibleItems', () => {
    let matListOptionsDE: DebugElement[];

    describe('set', () => {
      beforeEach(() => {
        component.maxVisibleItems = 2; // there are 5 values in the mock
        fixture.detectChanges();

        matListOptionsDE = componentDE.queryAll(By.css('mat-list-option'));
      });

      it("should only show the first 'maxVisibleItems' items", () => {
        expect(matListOptionsDE.length).toBe(component.maxVisibleItems);
      });

      it("should show 'toon meer...' when items are hidden", () => {
        component.showMore(false);
        fixture.detectChanges();

        expect(componentDE.nativeElement.textContent).toContain('toon meer...');
      });

      it("should show 'toon minder...' when items all items are visible", () => {
        component.showMore(true);
        fixture.detectChanges();

        expect(componentDE.nativeElement.textContent).not.toContain(
          'toon meer...'
        );
        expect(componentDE.nativeElement.textContent).toContain(
          'toon minder...'
        );
      });

      it("should not show 'toon meer/minder...' when no items are hidden", () => {
        component.maxVisibleItems = component.criterium.values.length;
        fixture.detectChanges();

        expect(componentDE.nativeElement.textContent).not.toContain(
          'toon meer...'
        );
        expect(componentDE.nativeElement.textContent).not.toContain(
          'toon minder...'
        );
      });
    });

    describe('not set', () => {
      beforeEach(() => {
        component.maxVisibleItems = null;
        fixture.detectChanges();

        matListOptionsDE = fixture.debugElement.queryAll(
          By.css('mat-list-option')
        );
      });

      it('should show all items', () => {
        expect(matListOptionsDE.length).toBe(component.criterium.values.length);
      });

      it("should not show 'toon meer/minder...'", () => {
        expect(componentDE.nativeElement.textContent).not.toContain(
          'toon meer...'
        );
        expect(componentDE.nativeElement.textContent).not.toContain(
          'toon minder...'
        );
      });
    });
  });

  describe('child', () => {
    let childDE: DebugElement;

    it('should create a child component when there is a child', () => {
      component.criterium.values[0].child = mockChildFilterCriteria;
      fixture.detectChanges();

      childDE = componentDE.query(
        By.css('campus-checkbox-selection-list-filter')
      );

      expect(childDE).toBeTruthy();
    });

    it('should not create a child component when there is no child', () => {
      childDE = componentDE.query(
        By.css('campus-checkbox-selection-list-filter')
      );

      expect(childDE).toBeFalsy();
    });
  });

  describe('filtering and sorting', () => {
    it('should filter out values that are not visible', () => {
      // doublecheck no values are filtered out at the moment
      expect(component.filteredFilterCriterium.values).toEqual(
        mockFilterCriteria.values
      );

      const changedFilterCriterium = { ...mockFilterCriteria };
      changedFilterCriterium.values[4].visible = false;
      component.criterium = changedFilterCriterium; // trigger setter

      expect(component.filteredFilterCriterium.values).not.toContain(
        component.criterium.values[4]
      );
    });

    it('should sort selected values to the front of the values-array', () => {
      // doublecheck values[4] isn't first on init
      expect(component.filteredFilterCriterium.values[0]).not.toBe(
        component.criterium.values[4]
      );

      const changedFilterCriterium = { ...mockFilterCriteria };
      changedFilterCriterium.values[4].selected = true;
      component.criterium = changedFilterCriterium; // trigger setter

      expect(component.filteredFilterCriterium.values[0]).toBe(
        component.criterium.values[4]
      );
    });
  });
});

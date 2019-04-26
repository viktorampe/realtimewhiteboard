import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MatCheckbox,
  MatCheckboxChange,
  MatCheckboxModule,
  MatIconModule,
  MatIconRegistry,
  MatListModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { MockMatIconRegistry } from '@campus/testing';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from '../../../+fixtures/search-filter-criteria.fixture';
import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from '../../../interfaces';
import { CheckboxListFilterComponent } from '../checkbox-list-filter.component';
import { CheckboxFilterComponent } from './checkbox-filter.component';

describe('CheckboxFilterComponent', () => {
  let component: CheckboxFilterComponent;
  let fixture: ComponentFixture<CheckboxFilterComponent>;
  let mockFilterCriteria: SearchFilterCriteriaInterface;
  let mockChildFilterCriteria: SearchFilterCriteriaInterface;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatListModule, MatCheckboxModule, FormsModule, MatIconModule],
      declarations: [CheckboxFilterComponent, CheckboxListFilterComponent],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    });
  }));

  beforeEach(() => {
    // create parent element as fixture
    fixture = TestBed.createComponent(CheckboxFilterComponent);

    mockChildFilterCriteria = new SearchFilterCriteriaFixture(
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
    );

    // by default without children
    mockFilterCriteria = new SearchFilterCriteriaFixture(
      { label: 'search filter' },
      [
        new SearchFilterCriteriaValuesFixture({
          data: {
            id: 1,
            name: 'Aardrijkskunde'
          }
        }),
        new SearchFilterCriteriaValuesFixture({
          data: {
            id: 2,
            name: 'Geschiedenis'
          }
        }),
        new SearchFilterCriteriaValuesFixture({
          data: {
            id: 3,
            name: 'Wiskunde'
          }
        }),
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

    component = fixture.componentInstance;
    component.criterium = mockFilterCriteria;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('maxVisibleItems', () => {
    let matListItemsDE: DebugElement[];

    describe('set', () => {
      beforeEach(() => {
        component.maxVisibleItems = 2; // there are 5 values in the mock
        component.criterium = component.criterium; // re-trigger setter
        fixture.detectChanges();

        matListItemsDE = fixture.debugElement.queryAll(
          By.css('[mat-list-item]')
        );
      });

      it("should only show the first 'maxVisibleItems' items", () => {
        const visibleOptions = matListItemsDE.filter(
          option => !option.classes['checkbox-filter__item--hidden']
        );
        expect(visibleOptions.length).toBe(component.maxVisibleItems);
      });

      it("should show 'toon meer...' when items are hidden", () => {
        // items are hidden by default
        expect(fixture.nativeElement.textContent).toContain('toon meer...');
      });

      it("should show 'toon minder...' when items all items are visible", () => {
        // items are hidden by default
        component.toggleShowMore();
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).not.toContain('toon meer...');
        expect(fixture.nativeElement.textContent).toContain('toon minder...');
      });

      it("should not show 'toon meer/minder...' when no items are hidden", () => {
        component.maxVisibleItems = component.criterium.values.length;
        component.criterium = component.criterium; // re-trigger setter
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).not.toContain('toon meer...');
        expect(fixture.nativeElement.textContent).not.toContain(
          'toon minder...'
        );
      });
    });

    describe('not set', () => {
      beforeEach(() => {
        component.maxVisibleItems = null;
        component.criterium = component.criterium; // re-trigger setter
        fixture.detectChanges();

        matListItemsDE = fixture.debugElement.queryAll(
          By.css('[mat-list-item]')
        );
      });

      it('should show all items', () => {
        expect(matListItemsDE.length).toBe(component.criterium.values.length);
      });

      it("should not show 'toon meer/minder...'", () => {
        expect(fixture.nativeElement.textContent).not.toContain('toon meer...');
        expect(fixture.nativeElement.textContent).not.toContain(
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

      childDE = fixture.debugElement.query(By.css('campus-checkbox-filter'));

      expect(childDE).toBeTruthy();
    });

    it('should not create a child component when there is no child', () => {
      childDE = fixture.debugElement.query(
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
      component.sortBySelection = true;

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

  describe('events', () => {
    let titleCheckBoxes: MatCheckbox[];
    let childComponents: CheckboxFilterComponent[];

    beforeEach(() => {
      // hook up a child to every value
      // spread operators to each criterium/value is another reference
      mockFilterCriteria.values.forEach(
        value =>
          (value.child = {
            ...mockChildFilterCriteria,
            ...{
              values: mockChildFilterCriteria.values.map(val => ({ ...val }))
            }
          })
      );

      component.criterium = mockFilterCriteria;
      fixture.detectChanges();

      titleCheckBoxes = fixture.debugElement
        .queryAll(By.directive(MatCheckbox))
        .map(checkbox => checkbox.componentInstance);

      childComponents = fixture.debugElement
        .queryAll(By.directive(CheckboxFilterComponent))
        .map(comp => comp.componentInstance);
    });

    describe('from self', () => {
      it('should update the criterium', () => {
        // doublecheck that the value is not selected by default
        expect(component.criterium.values[0].selected).toBe(false);

        titleCheckBoxes[0].checked = true;

        // emit checkbox changed event
        const changedEvent = new MatCheckboxChange();
        changedEvent.source = titleCheckBoxes[0];
        changedEvent.checked = titleCheckBoxes[0].checked;
        titleCheckBoxes[0].change.emit(changedEvent);

        expect(component.criterium.values[0].selected).toBe(true);
      });

      it('should notify the parent', () => {
        spyOn(component.selectionChanged, 'next');

        titleCheckBoxes[0].checked = true;

        // emit checkbox changed event
        const changedEvent = new MatCheckboxChange();
        changedEvent.source = titleCheckBoxes[0];
        changedEvent.checked = titleCheckBoxes[0].checked;
        titleCheckBoxes[0].change.emit(changedEvent);

        expect(component.selectionChanged.next).toHaveBeenCalled();
        expect(component.selectionChanged.next).toHaveBeenCalledTimes(1);
        expect(component.selectionChanged.next).toHaveBeenCalledWith(
          changedEvent
        );
      });

      it('should notify the children', () => {
        spyOn(component.notifyChildren$, 'next');

        titleCheckBoxes[0].checked = true;

        // emit checkbox changed event
        const changedEvent = new MatCheckboxChange();
        changedEvent.source = titleCheckBoxes[0];
        changedEvent.checked = titleCheckBoxes[0].checked;
        titleCheckBoxes[0].change.emit(changedEvent);

        expect(component.notifyChildren$.next).toHaveBeenCalled();
        expect(component.notifyChildren$.next).toHaveBeenCalledTimes(1);
        expect(component.notifyChildren$.next).toHaveBeenCalledWith(
          changedEvent
        );
      });
    });

    describe('from parent', () => {
      let firstChildComponent: CheckboxFilterComponent;
      let firstCheckbox: MatCheckbox;
      let firstCheckboxChildren: MatCheckbox[];
      let otherCheckboxChildren: MatCheckbox[];

      beforeEach(() => {
        component['ngAfterViewInit'](); // Needed to initialize subscriptions
        firstChildComponent = childComponents[0];
        firstCheckbox = titleCheckBoxes[0];
        firstCheckboxChildren = childComponents[0].matCheckBoxes.toArray();
        otherCheckboxChildren = [];
        for (let index = 1; index < childComponents.length; index++) {
          const child = childComponents[index];
          otherCheckboxChildren = [
            ...otherCheckboxChildren,
            ...child.matCheckBoxes.toArray()
          ];
        }
      });

      it("should change it's value, but only when the source is the associated parent checkbox", async(() => {
        // component's parent emits checkbox changed event
        firstCheckbox.checked = true;
        const changedEvent = new MatCheckboxChange();
        changedEvent.source = firstCheckbox;
        changedEvent.checked = firstCheckbox.checked;
        firstCheckbox.change.emit(changedEvent);
        fixture.detectChanges();

        // update component's value
        firstCheckboxChildren.forEach(checkbox => {
          expect(checkbox.checked).toBe(true);
          expect(
            ((checkbox.value as unknown) as SearchFilterCriteriaValuesInterface)
              .selected
          ).toBe(true);
        });

        // other children shouldn't update
        otherCheckboxChildren.forEach(checkbox => {
          expect(checkbox.checked).toBe(false);
          expect(
            ((checkbox.value as unknown) as SearchFilterCriteriaValuesInterface)
              .selected
          ).toBe(false);
        });
      }));

      it('should notify the children, but only when the source is the associated parent checkbox', () => {
        spyOn(firstChildComponent.notifyChildren$, 'next');
        spyOn(childComponents[1].notifyChildren$, 'next'); // only going to test 1 other childcomponent

        // component's parent emits checkbox changed event
        firstCheckbox.checked = true;
        const changedEvent = new MatCheckboxChange();
        changedEvent.source = firstCheckbox;
        changedEvent.checked = firstCheckbox.checked;
        firstCheckbox.change.emit(changedEvent);
        fixture.detectChanges();

        // notify component's children
        expect(firstChildComponent.notifyChildren$.next).toHaveBeenCalled();
        expect(firstChildComponent.notifyChildren$.next).toHaveBeenCalledTimes(
          firstChildComponent.matCheckBoxes.length // once per title checkbox
        );

        // other child components shouldn't notify their children
        expect(childComponents[1].notifyChildren$.next).not.toHaveBeenCalled();
      });

      it('should not notify the parent', () => {
        spyOn(firstChildComponent.selectionChanged, 'next');
        spyOn(childComponents[1].selectionChanged, 'next'); // only going to test 1 other childcomponent

        // component's parent emits checkbox changed event
        firstCheckbox.checked = true;
        const changedEvent = new MatCheckboxChange();
        changedEvent.source = firstCheckbox;
        changedEvent.checked = firstCheckbox.checked;
        firstCheckbox.change.emit(changedEvent);

        // don't notify component's parent
        expect(
          firstChildComponent.selectionChanged.next
        ).not.toHaveBeenCalled();

        // other child components shouldn't notify their parent
        expect(childComponents[1].selectionChanged.next).not.toHaveBeenCalled();
      });
    });

    describe('from children', () => {
      let firstChildComponent: CheckboxFilterComponent;
      let firstCheckbox: MatCheckbox;
      let firstCheckboxChildren: MatCheckbox[];
      let otherCheckboxChildren: MatCheckbox[];

      beforeEach(() => {
        firstChildComponent = childComponents[0];
        firstCheckbox = titleCheckBoxes[0];
        firstCheckboxChildren = childComponents[0].matCheckBoxes.toArray();
        otherCheckboxChildren = [];
        for (let index = 1; index < childComponents.length; index++) {
          const child = childComponents[index];
          otherCheckboxChildren = [
            ...otherCheckboxChildren,
            ...child.matCheckBoxes.toArray()
          ];
        }
      });

      it("should change it's value when the source is one of it's children", async(() => {
        //allow all viewchildren to fully render
        fixture.whenStable().then(() => {
          // doublecheck that the value is not selected
          expect(firstCheckbox.checked).toBe(false);

          // component's child emits checkbox changed event
          firstCheckboxChildren[0].checked = true;
          firstCheckboxChildren[0].indeterminate = false;
          const changedEvent = new MatCheckboxChange();
          changedEvent.source = firstCheckboxChildren[0];
          changedEvent.checked = firstCheckboxChildren[0].checked;
          firstCheckboxChildren[0].change.emit(changedEvent);

          // we've only checked one of the children
          expect(firstCheckbox.checked).toBe(false);
          expect(
            ((firstCheckbox.value as unknown) as SearchFilterCriteriaValuesInterface)
              .selected
          ).toBe(false);
        });
      }));

      it("shouldn't change it's value when the source is not one of it's children", async(() => {
        //allow all viewchildren to fully render
        fixture.whenStable().then(() => {
          // doublecheck that the value is not selected
          expect(firstCheckbox.checked).toBe(false);

          // other child emits checkbox changed event
          otherCheckboxChildren[0].checked = true;
          otherCheckboxChildren[0].indeterminate = false;
          const changedEvent = new MatCheckboxChange();
          changedEvent.source = otherCheckboxChildren[0];
          changedEvent.checked = otherCheckboxChildren[0].checked;
          otherCheckboxChildren[0].change.emit(changedEvent);

          // we haven't checked one of it's children
          expect(firstCheckbox.checked).toBe(false);
        });
      }));

      it("should become checked when all it's children are checked", async(() => {
        //allow all viewchildren to fully render
        fixture.whenStable().then(() => {
          // doublecheck that the value is not selected
          expect(firstCheckbox.checked).toBe(false);

          // check all component's children
          firstCheckboxChildren.forEach(child => {
            child.checked = true;
            child.indeterminate = false;
            const evt = new MatCheckboxChange();
            evt.source = child;
            evt.checked = child.checked;
            child.change.emit(evt);
          });

          // we've checked all of it's children
          expect(firstCheckbox.checked).toBe(true);
          expect(
            ((firstCheckbox.value as unknown) as SearchFilterCriteriaValuesInterface)
              .selected
          ).toBe(true);
        });
      }));

      it("should become unchecked when some but not all of it's children are checked", async(() => {
        //allow all viewchildren to fully render
        fixture.whenStable().then(() => {
          // doublecheck that the value is not selected
          expect(firstCheckbox.checked).toBe(false);

          // check all component's children, but not the first
          firstCheckboxChildren.slice(1).forEach(child => {
            child.checked = true;
            child.indeterminate = false;
            const evt = new MatCheckboxChange();
            evt.source = child;
            evt.checked = child.checked;
            child.change.emit(evt);
          });

          // we've some, but not all of it's children
          expect(firstCheckbox.checked).toBe(false);
          expect(
            ((firstCheckbox.value as unknown) as SearchFilterCriteriaValuesInterface)
              .selected
          ).toBe(false);
        });
      }));

      it("should become unchecked when all it's children are unchecked", async(() => {
        //allow all viewchildren to fully render
        fixture.whenStable().then(() => {
          // component's child emits checkbox changed event
          firstCheckboxChildren[0].checked = true;
          firstCheckboxChildren[0].indeterminate = false;
          const changedEvent = new MatCheckboxChange();
          changedEvent.source = firstCheckboxChildren[0];
          changedEvent.checked = firstCheckboxChildren[0].checked;
          firstCheckboxChildren[0].change.emit(changedEvent);

          // doublecheck: we've only checked one of the children
          expect(firstCheckbox.checked).toBe(false);

          // uncheck all component's children
          firstCheckboxChildren.forEach(child => {
            child.checked = false;
            child.indeterminate = false;
            const evt = new MatCheckboxChange();
            evt.source = child;
            evt.checked = child.checked;
            child.change.emit(evt);
          });

          expect(firstCheckbox.checked).toBe(false);
          expect(
            ((firstCheckbox.value as unknown) as SearchFilterCriteriaValuesInterface)
              .selected
          ).toBe(false);
        });
      }));

      it("should notify it's parent", async(() => {
        //allow all viewchildren to fully render
        fixture.whenStable().then(() => {
          spyOn(component.selectionChanged, 'next');

          // component's child emits checkbox changed event
          firstCheckboxChildren[0].checked = false;
          firstCheckboxChildren[0].indeterminate = true;
          const changedEvent = new MatCheckboxChange();
          changedEvent.source = firstCheckboxChildren[0];
          changedEvent.checked = firstCheckboxChildren[0].checked;
          firstCheckboxChildren[0].change.emit(changedEvent);

          expect(component.selectionChanged.next).toHaveBeenCalled();
          expect(component.selectionChanged.next).toHaveBeenCalledTimes(1);
        });
      }));

      it("shouldn't notify it's children", async(() => {
        //allow all viewchildren to fully render
        fixture.whenStable().then(() => {
          spyOn(component.notifyChildren$, 'next');

          // component's child emits checkbox changed event
          firstCheckboxChildren[0].checked = false;
          firstCheckboxChildren[0].indeterminate = true;
          const changedEvent = new MatCheckboxChange();
          changedEvent.source = firstCheckboxChildren[0];
          changedEvent.checked = firstCheckboxChildren[0].checked;
          firstCheckboxChildren[0].change.emit(changedEvent);

          expect(component.notifyChildren$.next).not.toHaveBeenCalled();
        });
      }));
    });
  });

  describe('selection and indeterminate status', () => {
    let mockFilterCriteriaWithSelection: SearchFilterCriteriaInterface;

    beforeEach(() => {
      // create clone of original value
      mockFilterCriteriaWithSelection = {
        ...mockFilterCriteria,
        values: mockFilterCriteria.values.map(value => ({ ...value }))
      };
    });

    it('should apply the selection in the searchState to the checkboxes', () => {
      // selection, trust me: it's random
      mockFilterCriteriaWithSelection.values[0].selected = true;
      mockFilterCriteriaWithSelection.values[1].selected = false;
      mockFilterCriteriaWithSelection.values[2].selected = false;
      mockFilterCriteriaWithSelection.values[3].selected = true;
      mockFilterCriteriaWithSelection.values[4].selected = false;

      component.criterium = mockFilterCriteriaWithSelection;
      fixture.detectChanges();

      const checkBoxes: MatCheckbox[] = fixture.debugElement
        .queryAll(By.directive(MatCheckbox))
        .map(dE => dE.componentInstance);

      for (
        let index = 0;
        index < mockFilterCriteriaWithSelection.values.length;
        index++
      ) {
        // using filteredFilterCriterium because values are sorted/filtered
        expect(checkBoxes[index].checked).toBe(
          component.filteredFilterCriterium.values[index].selected
        );
      }
    });

    describe('indeterminate status', () => {
      it('should be calculated for each checkbox', () => {
        component.criterium = mockFilterCriteriaWithSelection;

        for (
          let index = 0;
          index < mockFilterCriteriaWithSelection.values.length;
          index++
        ) {
          expect(
            component.indeterminateStatus[
              mockFilterCriteriaWithSelection.values[index].data.id
            ]
          ).toBeDefined();
        }
        expect(
          component.indeterminateStatus['key_does_not_exist']
        ).toBeUndefined();
      });

      it('should be false when there are no children', () => {
        component.criterium = mockFilterCriteriaWithSelection;

        expect(
          Object.values(component.indeterminateStatus).every(
            status => status === false
          )
        ).toBe(true);
      });

      describe('with children', () => {
        let filterValueWithChild: SearchFilterCriteriaValuesInterface;
        let filterValueWithChildKey: string;

        beforeEach(() => {
          filterValueWithChild = mockFilterCriteriaWithSelection.values[0];
          filterValueWithChildKey = filterValueWithChild.data.id;

          mockFilterCriteriaWithSelection.values[0].child = {
            ...mockChildFilterCriteria,
            values: mockChildFilterCriteria.values.map(value => ({ ...value }))
          };
        });

        it('should be true when some, but not all child checkboxes are checked', () => {
          filterValueWithChild.child.values[0].selected = true;
          filterValueWithChild.child.values[1].selected = false;
          component.criterium = mockFilterCriteriaWithSelection;

          expect(component.indeterminateStatus[filterValueWithChildKey]).toBe(
            true
          );
        });

        it('should be false when all child checkboxes are checked', () => {
          filterValueWithChild.child.values.forEach(
            value => (value.selected = true)
          );

          component.criterium = mockFilterCriteriaWithSelection;

          expect(component.indeterminateStatus[filterValueWithChildKey]).toBe(
            false
          );
        });

        it('should be false when no child checkboxes are checked', () => {
          filterValueWithChild.child.values.forEach(
            value => (value.selected = false)
          );

          component.criterium = mockFilterCriteriaWithSelection;

          expect(component.indeterminateStatus[filterValueWithChildKey]).toBe(
            false
          );
        });
      });
    });
  });
});

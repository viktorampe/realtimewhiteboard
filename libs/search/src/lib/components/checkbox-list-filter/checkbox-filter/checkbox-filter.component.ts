import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from '../../../interfaces';

@Component({
  selector: 'campus-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.scss']
})
export class CheckboxFilterComponent implements AfterViewInit, OnDestroy {
  public showMoreItems: boolean; // expand aantal zichtbare titels
  public filteredFilterCriterium: SearchFilterCriteriaInterface;
  public notifyChildren$ = new Subject<MatCheckboxChange>();
  public indeterminateStatus: { [key: string]: boolean };
  public showMoreStatus: boolean;

  private subscriptions = new Subscription();
  private _criterium: SearchFilterCriteriaInterface;
  private associatedCheckBoxes: AssociatedCheckBoxesInterface[];

  @Input() maxVisibleItems: number; // aantal zichtbare titels

  get criterium(): SearchFilterCriteriaInterface {
    return this._criterium;
  }
  @Input()
  set criterium(value: SearchFilterCriteriaInterface) {
    this._criterium = value;
    this.filteredFilterCriterium = this.getFilteredCriterium(
      value,
      this.sortBySelection
    );

    this.indeterminateStatus = {};
    this.filteredFilterCriterium.values.forEach(critValue => {
      this.indeterminateStatus[critValue.data.id] = this.getIndeterminateStatus(
        critValue
      );
    });

    this.showMoreStatus = this.getShowMoreStatus(
      this.maxVisibleItems,
      this.filteredFilterCriterium,
      this.indeterminateStatus
    );
  }

  @Input() public parentValueRef: SearchFilterCriteriaValuesInterface;
  @Input() public sortBySelection: boolean;

  @Input()
  public set notificationFromParent(event: MatCheckboxChange) {
    // doesn't store the value, used as trigger
    this.onParentChange(event);
  }

  @Output() public selectionChanged = new Subject<MatCheckboxChange>();

  // These are all the 'title'-checkboxes
  @ViewChildren(MatCheckbox)
  public matCheckBoxes: QueryList<MatCheckbox>;

  // These are all the 'items'-childcomponents
  @ViewChildren(CheckboxFilterComponent)
  private childComponents: QueryList<CheckboxFilterComponent>;

  ngAfterViewInit() {
    // setTimeout to allow children's views to be initialised
    setTimeout(() => {
      // since matCheckBoxes and childComponents are lists of all elements
      // these need to be linked
      this.associatedCheckBoxes = this.getAssociateCheckboxes(
        this.matCheckBoxes,
        this.childComponents
      );
    });

    // make children listen to parent
    // setting up subscriptions in template with Async pipe not possible
    this.childComponents.forEach(child => {
      this.subscriptions.add(
        this.notifyChildren$.subscribe(
          event => (child.notificationFromParent = event)
        )
      );
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public getDisplayValue(value: SearchFilterCriteriaValuesInterface): string {
    return value.data[this.criterium.displayProperty];
  }

  // calculates if a 'show more' link is needed
  private getShowMoreStatus(
    maxVisibleItems: number,
    filterCriterium: SearchFilterCriteriaInterface,
    indeterminateStatusDict
  ): boolean {
    if (!!maxVisibleItems && filterCriterium.values.length > maxVisibleItems) {
      const valuesAboveMaxVisibleItems = filterCriterium.values.slice(
        maxVisibleItems
      );

      const invisibleItems = valuesAboveMaxVisibleItems.filter(
        value => !value.selected && !indeterminateStatusDict[value.data.id]
      );

      return invisibleItems.length > 0;
    } else {
      return false;
    }
  }

  // calculates if a checkbox selection status is indeterminate
  // based on the selection values of it's children
  private getIndeterminateStatus(
    filterCriteriaValue: SearchFilterCriteriaValuesInterface
  ): boolean {
    return (
      !filterCriteriaValue.selected &&
      !!filterCriteriaValue.child &&
      !(
        filterCriteriaValue.child.values.every(
          childValue => childValue.selected
        ) ||
        filterCriteriaValue.child.values.every(
          childValue => !childValue.selected
        )
      )
    );
  }

  // expand aantal zichtbare titels bij CHILD
  public toggleShowMore() {
    this.showMoreItems = !this.showMoreItems;
  }

  public onChange(
    event: MatCheckboxChange,
    tunnel: boolean = true,
    bubble: boolean = true
  ): void {
    if (!event) return;

    // update criterium -> this is byRef
    this.convertCheckBoxValue(event.source).selected = event.checked;

    // notify parent
    if (bubble) this.selectionChanged.next(event);

    // notify children
    if (tunnel) this.notifyChildren$.next(event);
  }

  public onChildChange(event: MatCheckboxChange): void {
    if (!event) return;

    // find parent of the child
    const parentAssociation = this.associatedCheckBoxes.find(
      association =>
        association.children &&
        association.children.some(child => child === event.source)
    );

    // check the checked status of children
    const childrenStatus = this.getAllChildrenStatus(parentAssociation);
    if (childrenStatus.allChecked) {
      parentAssociation.parent.checked = true;
    } else if (childrenStatus.allUnChecked) {
      parentAssociation.parent.checked = false;
    } else {
      parentAssociation.parent.checked = false;
    }

    // notify parent
    const changedEvent = new MatCheckboxChange();
    changedEvent.source = parentAssociation.parent;
    changedEvent.checked = parentAssociation.parent.checked;
    this.onChange(changedEvent, false, true);
  }

  private onParentChange(event: MatCheckboxChange) {
    if (!event) return;
    // check if the emitting parent is my parent
    if (this.convertCheckBoxValue(event.source) === this.parentValueRef) {
      this.matCheckBoxes.forEach(checkbox => {
        checkbox.checked = event.checked;
        checkbox.indeterminate = false;

        // notify children
        const changedEvent = new MatCheckboxChange();
        changedEvent.source = checkbox;
        changedEvent.checked = checkbox.checked;
        this.onChange(changedEvent, true, false);
      });
    }
  }

  // filter and sort values
  private getFilteredCriterium(
    criterium: SearchFilterCriteriaInterface,
    sortBySelection?: boolean
  ): SearchFilterCriteriaInterface {
    const filteredCriterium = {
      ...criterium,
      values: criterium.values.filter(
        value => value.visible && (value.prediction !== 0 || value.selected)
      )
    };
    if (sortBySelection)
      filteredCriterium.values.sort((a, b) =>
        a.selected === b.selected ? 0 : a.selected ? -1 : 1
      );
    return filteredCriterium;
  }

  // helper function to convert MatCheckBox value (a string by default)
  // to a SearchFilterCriteriaValuesInterface (which is what is actually set)
  private convertCheckBoxValue(
    checkBox: MatCheckbox
  ): SearchFilterCriteriaValuesInterface {
    return (checkBox.value as unknown) as SearchFilterCriteriaValuesInterface;
  }

  // helper function to match the 'title'-checkboxes
  // with their child checkboxes
  private getAssociateCheckboxes(
    parentCheckBoxes: QueryList<MatCheckbox>,
    childComponents: QueryList<CheckboxFilterComponent>
  ): AssociatedCheckBoxesInterface[] {
    return parentCheckBoxes.map(parent => {
      // not all checkboxes have children
      const matchingChildren = childComponents.length
        ? childComponents.find(
            child => child.parentValueRef === this.convertCheckBoxValue(parent)
          )
        : null;

      return {
        parent,
        children: matchingChildren ? matchingChildren.matCheckBoxes : null
      };
    });
  }

  // helper function to check the checked-status of the children
  private getAllChildrenStatus(
    checkboxAssociation: AssociatedCheckBoxesInterface
  ): ChildrenStatusInterface {
    return {
      allChecked: checkboxAssociation.children // null check
        ? checkboxAssociation.children
            .toArray()
            .every(child => child.checked && !child.indeterminate)
        : true, // if no children -> parent should respond as if they're all selected

      allUnChecked: checkboxAssociation.children // null check
        ? checkboxAssociation.children
            .toArray()
            .every(child => !child.checked && !child.indeterminate)
        : false // if no children -> parent should respond as if they're all selected
    };
  }
}

interface ChildrenStatusInterface {
  allChecked: boolean;
  allUnChecked: boolean;
}

interface AssociatedCheckBoxesInterface {
  parent: MatCheckbox;
  children: QueryList<MatCheckbox>;
}

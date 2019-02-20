import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material';
import { SearchFilterCriteriaInterface } from '@campus/search';
import { Observable, Subject, Subscription } from 'rxjs';
import { SearchFilterCriteriaValuesInterface } from '../../../interfaces';

@Component({
  selector: 'campus-checkbox-selection-list-filter',
  templateUrl: './checkbox-selection-list-filter.component.html',
  styleUrls: ['./checkbox-selection-list-filter.component.scss']
})
export class CheckboxSelectionListFilterComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public showMoreItems: boolean; // expand aantal zichtbare titels
  public filteredFilterCriterium: SearchFilterCriteriaInterface;
  public notifyChildren$ = new Subject<MatCheckboxChange>();

  private _criterium: SearchFilterCriteriaInterface;
  private subscriptions = new Subscription();
  private associatedCheckBoxes: AssociatedCheckBoxesInterface[];

  @Input() maxVisibleItems: number; // aantal zichtbare titels

  @Input()
  get criterium(): SearchFilterCriteriaInterface {
    return this._criterium;
  }
  set criterium(value: SearchFilterCriteriaInterface) {
    if (this._criterium === value) return;

    this._criterium = value;
    this.filteredFilterCriterium = this.getFilteredCriterium(value);
  }

  @Input() public parentValueRef: SearchFilterCriteriaValuesInterface;

  @Input() notificationFromParent$: Observable<MatCheckboxChange>;

  @Output() public selectionChanged = new Subject<MatCheckboxChange>();

  // These are all the 'title'-checkboxes
  @ViewChildren(MatCheckbox)
  public matCheckBoxes: QueryList<MatCheckbox>;

  // These are all the 'items'-childcomponents
  @ViewChildren(CheckboxSelectionListFilterComponent)
  private childComponents: QueryList<CheckboxSelectionListFilterComponent>;

  ngOnInit() {
    // listen for updates from the parent
    if (this.notificationFromParent$)
      this.subscriptions.add(
        this.notificationFromParent$.subscribe(event =>
          this.onParentChange(event)
        )
      );
  }

  ngAfterViewInit() {
    // since matCheckBoxes and childComponents are list of all elements
    // these need to be linked
    // setTimeout to allow children's views to be initialised
    setTimeout(() => {
      this.associatedCheckBoxes = this.getAssociateCheckboxes(
        this.matCheckBoxes,
        this.childComponents
      );
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // expand aantal zichtbare titels bij CHILD
  public showMore(value: boolean) {
    this.showMoreItems = value;
  }

  public onChange(event: MatCheckboxChange): void {
    if (!event) return;

    // notify parent
    this.selectionChanged.next(event);

    // notify children
    this.notifyChildren$.next(event);
  }

  public onChildChange(event: MatCheckboxChange): void {
    if (!event) return;

    const parentAssociation = this.associatedCheckBoxes.find(association =>
      association.children.some(child => child === event.source)
    );

    // check the checked status of children
    const childrenStatus = this.getAllChildrenStatus(parentAssociation);
    if (childrenStatus.allChecked) {
      parentAssociation.parent.checked = true;
      parentAssociation.parent.indeterminate = false;
    } else if (childrenStatus.allUnChecked) {
      parentAssociation.parent.checked = false;
      parentAssociation.parent.indeterminate = false;
    } else parentAssociation.parent.indeterminate = true;

    // notify parent
    const changedEvent = new MatCheckboxChange();
    changedEvent.source = parentAssociation.parent;
    changedEvent.checked = parentAssociation.parent.checked;
    this.selectionChanged.next(changedEvent);
  }

  private onParentChange(event: MatCheckboxChange) {
    if (!event) return;

    if (this.convertCheckBoxValue(event.source) === this.parentValueRef) {
      this.matCheckBoxes.forEach(checkbox => {
        checkbox.checked = event.checked;
        checkbox.indeterminate = false;

        // notify children
        const changedEvent = new MatCheckboxChange();
        changedEvent.source = checkbox;
        changedEvent.checked = checkbox.checked;
        this.notifyChildren$.next(changedEvent);
      });
    }
  }

  // filter and sort values
  private getFilteredCriterium(
    criterium: SearchFilterCriteriaInterface
  ): SearchFilterCriteriaInterface {
    return {
      ...criterium,
      ...{
        values: criterium.values
          .filter(value => value.visible && value.prediction !== 0)
          // order by selected status
          // needed so selected values aren't hidden
          .sort((a, b) => (a.selected === b.selected ? 0 : a.selected ? -1 : 1))
      }
    };
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
    childComponents: QueryList<CheckboxSelectionListFilterComponent>
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
      allChecked: checkboxAssociation.children
        .toArray()
        .every(
          child => child.checked === true && child.indeterminate === false
        ),
      allUnChecked: checkboxAssociation.children
        .toArray()
        .every(
          child => child.checked === false && child.indeterminate === false
        )
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

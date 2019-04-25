import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchFilterComponentInterface, SearchFilterCriteriaInterface, SearchFilterCriteriaValuesInterface } from '../../interfaces';
import { ColumnFilterService } from './column-filter.service';

@Component({
  selector: 'campus-column-filter',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition('* => forwardEnter', [
        //enter from left to right
        style({ transform: 'translateX(-50%)' }),
        animate('2000ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition('* => backwardEnter', [
        //enter from right to left
        style({ transform: 'translateX(0%)' }),
        animate('2000ms ease-in-out', style({ transform: 'translateX(-50%)' }))
      ])
    ])
  ]
})
export class ColumnFilterComponent implements SearchFilterComponentInterface {
  private _filterCriteria: SearchFilterCriteriaInterface[];
  private forwardAnimation: boolean;
  filterCriteriaToToggle: SearchFilterCriteriaInterface[];

  @Input()
  public set filterCriteria(value: SearchFilterCriteriaInterface[]) {
    if (value) {
      // input is set by searchComponent, which can also be a single criterium
      if (!Array.isArray(value)) value = [value];

      if (this.columnFilterService.actionSource !== 'self') {
        if (this.columnFilterService.preserveColumn) {
          this.columnFilterService.preserveColumn =
            this.columnFilterService.previousFilterCriteriaCount >=
            value.length - 1;
        } else {
          if (
            this.columnFilterService.previousFilterCriteriaCount ===
            value.length
          ) {
            this.columnFilterService.preserveColumn = true;
          }
        }
      }

      this.forwardAnimation =
        this.columnFilterService.previousFilterCriteriaCount > value.length;
      this.columnFilterService.previousFilterCriteriaCount = value.length;

      if (this.columnFilterService.preserveColumn) {
        // render last 2 columns
        // because clicking through to the next level will not trigger new filterCriteria,
        // we want the next level to already be ready in the tree
        // unless we selected an item in the deepest level
        const lastColumn = value.slice(-1)[0];
        const sliceColumns = lastColumn.values.find(v => v.selected) ? -1 : -2;
        this.filterCriteriaToToggle = value.slice(sliceColumns);
      } else {
        const newCriteria: SearchFilterCriteriaInterface = value.slice(-1)[0];
        this.filterCriteriaToToggle = this.forwardAnimation
          ? [newCriteria, this.columnFilterService.previousFilterCriteria]
          : [this.columnFilterService.previousFilterCriteria, newCriteria];
      }

      this.columnFilterService.actionSource = null;
    }

    this._filterCriteria = value;
  }
  public get filterCriteria() {
    return this._filterCriteria;
  }

  @Output()
  filterSelectionChange = new EventEmitter<SearchFilterCriteriaInterface[]>();

  constructor(private columnFilterService: ColumnFilterService) {}

  /**
   * returns the animation state string that is used to provide forward or backward animations
   * forward means the animation will go from left to right, backward from right to left
   *
   * @returns {string}
   * @memberof ColumnFilterComponent
   */
  animationState(): string {
    if (this.columnFilterService.preserveColumn) {
      return 'noAnimation';
    }
    return this.forwardAnimation ? 'forwardEnter' : 'backwardEnter';
  }

  animationDone(event): void {
    if (event.toState === 'backwardEnter') {
      // remove first column
      this.filterCriteriaToToggle = this.filterCriteriaToToggle.slice(1, 2);
    } else if (event.toState === 'forwardEnter') {
      // remove last column
      this.filterCriteriaToToggle = this.filterCriteriaToToggle.slice(0, 1);
    }
    this.columnFilterService.previousFilterCriteria = this.filterCriteriaToToggle[0];
  }

  onFilterSelectionChange(
    filterCriterionValue: SearchFilterCriteriaValuesInterface,
    preserveColumn: boolean = false,
    filterCriterionName: string
  ) {
    const selectionChanged = filterCriterionValue.selected !== true;
    this.columnFilterService.preserveColumn =
      preserveColumn || filterCriterionValue.hasChild === false;
    this.columnFilterService.actionSource = 'self';

    // first reset all selected markers of criteria with the same name to false
    this.filterCriteria
      .filter(crit => crit.name === filterCriterionName)
      .forEach(crit => {
        crit.values.forEach(value => {
          value.selected = false;
        });
      });

    // then set the passed value to selected true
    filterCriterionValue.selected = true;

    if (selectionChanged) {
      this.filterSelectionChange.emit(this.filterCriteria);
    } else {
      this.columnFilterService.actionSource = null;
    }
  }
}

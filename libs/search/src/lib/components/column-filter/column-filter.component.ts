import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  SearchFilterComponentInterface,
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from '../../interfaces';
import { ColumnFilterService } from './column-filter.service';

@Component({
  selector: 'campus-column-filter',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition('* => forwardEnter', [
        //enter from right to left
        style({ transform: 'translateX(-50%)' }),
        animate('2000ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition('* => backwardEnter', [
        //enter from left to right
        style({ transform: 'translateX(0%)' }),
        animate('2000ms ease-in-out', style({ transform: 'translateX(-50%)' }))
      ])
    ])
  ]
})
export class ColumnFilterComponent implements SearchFilterComponentInterface {
  private _filterCriteria: SearchFilterCriteriaInterface[];
  filterCriteriaToToggle: SearchFilterCriteriaInterface[];

  @Input()
  public set filterCriteria(value: SearchFilterCriteriaInterface[]) {
    if (value) {
      // input is set by searchComponent, which can also be a single criterium
      if (!Array.isArray(value)) value = [value];

      this.columnFilterService.forwardAnimation =
        this.columnFilterService.previousFilterCriteriaCount > value.length;
      this.columnFilterService.previousFilterCriteriaCount = value.length;

      const newCriteria: SearchFilterCriteriaInterface = value.slice(-1)[0];
      this.filterCriteriaToToggle = this.columnFilterService.forwardAnimation
        ? [newCriteria, this.columnFilterService.previousFilterCriteria]
        : [this.columnFilterService.previousFilterCriteria, newCriteria];
      this.columnFilterService.previousFilterCriteria = newCriteria;
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
   * returns the animation state string that is used to provide specific animations of forward and backward enter
   * forward means the animation will go from left to right, backward from right to left
   *
   * @returns {string}
   * @memberof ColumnFilterComponent
   */
  animationState(): string {
    if (this.columnFilterService.preserveColumn) {
      return 'noAnimation';
    }
    return `${
      this.columnFilterService.forwardAnimation ? 'forward' : 'backward'
    }Enter`;
  }

  animationDone(event): void {
    if (event.toState === 'backwardEnter') {
      // remove first column
      this.filterCriteriaToToggle = this.filterCriteriaToToggle.slice(1, 2);
    } else if (event.toState === 'forwardEnter') {
      // remove last column
      this.filterCriteriaToToggle = this.filterCriteriaToToggle.slice(0, 1);
    }
  }

  onFilterSelectionChange(
    filterCriterionValue: SearchFilterCriteriaValuesInterface,
    preserveColumn: boolean = false,
    filterCriterionName: string
  ) {
    const selectionChanged = !filterCriterionValue.selected;
    this.columnFilterService.preserveColumn = preserveColumn;

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
    }
  }
}

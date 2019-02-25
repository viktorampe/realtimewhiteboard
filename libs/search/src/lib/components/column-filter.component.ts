import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  SearchFilterComponentInterface,
  SearchFilterCriteriaInterface
} from '../interfaces';

@Component({
  selector: 'campus-column-filter',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition('* => forwardEnter', [
        //enter from right to left
        style({ transform: 'translateX(100%)' }),
        animate('200ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition('* => backwardEnter', [
        //enter from left to right, position absolute needs to be added so a redrew due a new array will work
        style({ transform: 'translateX(-100%)', position: 'absolute' }),
        animate('200ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(
        'forwardEnter => forwardLeave, backwardEnter => forwardLeave',
        [
          // leave right to left (* can not be used, only entered elements can animate leave)
          style({ position: 'absolute' }),
          animate(
            '200ms ease-in-out',
            style({ transform: 'translateX(-100%)' })
          )
        ]
      ),
      transition(
        'forwardEnter => backwardLeave, backwardEnter => backwardLeave, forwardEnter => void, backwardEnter => void',
        [
          // leave left to right, (* can not be used, only entered elements can animate leave)
          style({ position: 'absolute' }),
          animate('200ms ease-in-out', style({ transform: 'translateX(100%)' }))
        ]
      ),
      state('backwardEnter', style({ position: 'static' })), // set enter style absolute back to default static
      state('forwardLeave', style({ display: 'none' })), // hide using display none
      state('backwardLeave', style({ display: 'none' })) // hide using display none
    ])
  ]
})
export class ColumnFilterComponent implements SearchFilterComponentInterface {
  private _filterCriteria: SearchFilterCriteriaInterface[];
  private previousFilterCriteriaCount: number;
  preserveColumn = false;
  forwardAnimation = true;

  @Input()
  public set filterCriteria(value: SearchFilterCriteriaInterface[]) {
    if (value) {
      this.forwardAnimation = this.previousFilterCriteriaCount < value.length;
      this.previousFilterCriteriaCount = value.length;
    }
    this._filterCriteria = value;
  }
  public get filterCriteria() {
    return this._filterCriteria;
  }

  @Output()
  filterSelectionChange = new EventEmitter<SearchFilterCriteriaInterface[]>();

  /**
   * determines if a column should be visible or not
   *
   * @param {number} columnIndex
   * @returns {boolean}
   * @memberof ColumnFilterComponent
   */
  columnVisible(columnIndex: number): boolean {
    return (
      columnIndex === this.filterCriteria.length - (this.preserveColumn ? 2 : 1)
    );
  }

  /**
   * returns the animation state string that is used to provide specific animations of enter , leave , forward and backward
   * the string wil always be a combination of these options, eg forwardEnter, forwardLeave, backwardEnter, backwardLeave
   *
   * forward means the animation will go from right to left, backward from left to right
   *
   * Enter meand the animation will make the element enter the page to stay, Leave means the animation will make the element disappear
   *
   * @param {number} columnIndex
   * @returns {string}
   * @memberof ColumnFilterComponent
   */
  animationState(columnIndex: number): string {
    return `${this.forwardAnimation ? 'forward' : 'backward'}${
      this.columnVisible(columnIndex) ? 'Enter' : 'Leave'
    }`;
  }

  onFilterSelectionChange(
    filterCriterionValue,
    preserveColumn: boolean = false
  ) {
    this.preserveColumn = preserveColumn;
    // first reset alle selected markers to false
    this.filterCriteria.forEach(filterCriterion => {
      filterCriterion.values.forEach(value => {
        value.selected = false;
      });
    });
    // then set the passed value to selected true
    filterCriterionValue.selected = true;
    this.filterSelectionChange.emit(this.filterCriteria);
  }
}

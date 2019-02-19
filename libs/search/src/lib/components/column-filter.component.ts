import {
  animate,
  animateChild,
  query,
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
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        style({ position: 'absolute' }),
        query('@slideInOut', [animateChild()], { optional: true }), // needed so the animation is not forcibly ended by the new enter animation
        animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class ColumnFilterComponent implements SearchFilterComponentInterface {
  preserveColumn = false;

  @Input() filterCriteria: SearchFilterCriteriaInterface[];
  @Output()
  filterSelectionChange = new EventEmitter<SearchFilterCriteriaInterface[]>();
  constructor() {}

  showColumn(columnIndex: number) {
    return (
      columnIndex === this.filterCriteria.length - (this.preserveColumn ? 2 : 1)
    );
  }

  onFilterSelectionChange(
    keyProperty: string,
    preserveColumn: boolean = false
  ) {
    this.preserveColumn = preserveColumn;
    this.filterCriteria.forEach(filterCriterion => {
      filterCriterion.values.forEach(value => {
        value.selected =
          value.data[filterCriterion.keyProperty] === keyProperty;
      });
    });
    this.filterSelectionChange.emit(this.filterCriteria);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchFilterComponentInterface } from '../../interfaces/search-filter-component-interface';
import { SearchFilterCriteriaInterface } from '../../interfaces/search-filter-criteria.interface';

@Component({
  selector: 'campus-breadcrumb-filter',
  templateUrl: './breadcrumb-filter.component.html',
  styleUrls: ['./breadcrumb-filter.component.scss']
})
export class BreadcrumbFilterComponent
  implements SearchFilterComponentInterface {
  criteria: SearchFilterCriteriaInterface[];
  selectedValues: object[]; // TODO: use interface

  @Input() rootLabel: string;
  @Input()
  set filterCriteria(filterCriteria: SearchFilterCriteriaInterface[]) {
    this.selectedValues = [];
    filterCriteria.forEach(criteria => {
      const selectedValue = criteria.values.find(value => value.selected);
      if (selectedValue) {
        this.selectedValues.push(selectedValue);
      }
    });
    this.criteria = filterCriteria;
  }
  @Output() filterSelectionChange = new EventEmitter<
    SearchFilterCriteriaInterface[]
  >();

  constructor() {}

  getLabel(value: object) {}

  reset() {
    const filterCriteria = this.criteria[0];
    filterCriteria.values.forEach(criterium => (criterium.selected = false));
    this.filterSelectionChange.emit(this.criteria.slice(0, 1));
  }

  clickBreadcrumb(index: number) {
    this.filterSelectionChange.emit(this.criteria.slice(0, index + 1));
  }
}

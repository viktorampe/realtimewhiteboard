import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchFilterComponentInterface } from '../../interfaces/search-filter-component-interface';
import { SearchFilterCriteriaInterface } from '../../interfaces/search-filter-criteria.interface';

@Component({
  selector: 'campus-breadcrumb-filter',
  templateUrl: './breadcrumb-filter.component.html',
  styleUrls: ['./breadcrumb-filter.component.scss']
})
export class BreadcrumbFilterComponent
  implements SearchFilterComponentInterface<unknown, unknown> {
  @Input() filterCriteria: SearchFilterCriteriaInterface<unknown, unknown>;
  @Output() filterSelectionChange = new EventEmitter<
    | SearchFilterCriteriaInterface<unknown, unknown>
    | SearchFilterCriteriaInterface<unknown, unknown>[]
  >();

  constructor() {}

  clickBreadcrumb() {
    this.filterSelectionChange.emit();
  }
}

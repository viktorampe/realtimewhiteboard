import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchFilterComponentInterface } from '../../interfaces/search-filter-component-interface';
import { SearchFilterCriteriaInterface } from '../../interfaces/search-filter-criteria.interface';

@Component({
  selector: 'campus-breadcrumb-filter',
  templateUrl: './breadcrumb-filter.component.html',
  styleUrls: ['./breadcrumb-filter.component.scss']
})
export class BreadcrumbFilterComponent
  implements OnInit, SearchFilterComponentInterface {
  protected showSeperator: boolean;
  protected _filterCriteria: SearchFilterCriteriaInterface[];

  @Input() rootLabel: string;
  @Input()
  set filterCriteria(filterCriteria: SearchFilterCriteriaInterface[]) {
    this._filterCriteria = filterCriteria;
    this.checkSeparator();
  }
  @Output() filterSelectionChange = new EventEmitter<
    SearchFilterCriteriaInterface[]
  >();

  constructor() {}

  ngOnInit(): void {}

  checkSeparator() {
    this.showSeperator = !!this._filterCriteria[0].values.find(
      value => value.selected
    );
  }

  reset() {
    const filterCriteria = this._filterCriteria[0];
    filterCriteria.values.map(criterium => (criterium.selected = false));
    this.filterSelectionChange.emit(this._filterCriteria.slice(0, 1));
  }

  getLabel(filterCriterium: SearchFilterCriteriaInterface): string {
    const selectedCriterium = filterCriterium.values.find(
      criterium => criterium.selected
    );
    return selectedCriterium
      ? selectedCriterium.data[filterCriterium.displayProperty]
      : null;
  }

  clickBreadcrumb(index: number) {
    this.filterSelectionChange.emit(this._filterCriteria.slice(0, index + 1));
  }
}

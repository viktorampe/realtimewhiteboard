import { EventEmitter } from '@angular/core';


export interface SearchFilterComponentInterface {
  filterCriteria : SearchFilterCriteriaInterface // FilterCriteriaInterface ?
  filterSelectionChange: EventEmitter<SearchFilterCriteriaInterface|SearchFilterCriteriaInterface[])>
}

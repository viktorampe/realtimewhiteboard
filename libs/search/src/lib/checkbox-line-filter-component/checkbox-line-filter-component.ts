import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchFilterComponentInterface } from '../interfaces/search-filter-component-interface';
import { SearchFilterCriteriaInterface } from '../interfaces/search-filter-criteria.interface';

class TestData {
  data = 'test';
  selected = true;
  prediction = 1;
  visible = true;
}

@Component({
  selector: 'campus-checkbox-line-filter',
  templateUrl: './checkbox-line-filter-component.html',
  styleUrls: ['./checkbox-line-filter-component.scss']
})
export class CheckboxLineFilterComponent
  implements OnInit, SearchFilterComponentInterface<any, any> {
  @Input() filterCriteria: SearchFilterCriteriaInterface<any, any>;
  @Output() filterSelectionChange = new EventEmitter<
    | SearchFilterCriteriaInterface<any, any>
    | SearchFilterCriteriaInterface<any, any>[]
  >();

  constructor() {}

  ngOnInit() {
    this.filterCriteria = {
      name: 'selectFilter',
      label: 'select filter',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [
        {
          data: {
            id: 1,
            name: 'foo'
          },
          selected: false,
          prediction: 0,
          visible: true,
          children: null
        },
        {
          data: {
            id: 2,
            name: 'bar'
          },
          selected: false,
          prediction: 0,
          visible: true,
          children: null
        }
      ]
    };
  }

  itemChanged(value: SearchFilterCriteriaInterface<unknown, unknown>) {
    this.filterSelectionChange.emit(value);
  }
}

import { AfterContentInit, Component, OnInit } from '@angular/core';
import { SearchFilterCriteriaInterface } from 'libs/search/src/lib/interfaces/search-filter-criteria.interface';

@Component({
  selector: 'campus-finding-nemo',
  templateUrl: './finding-nemo.component.html',
  styleUrls: ['./finding-nemo.component.scss']
})
export class FindingNemoComponent implements OnInit, AfterContentInit {
  public filterCriteria: any[];
  public selectFilter: SearchFilterCriteriaInterface;

  constructor() {}

  public onSelectionChange(event) {
    console.log(event);
    this.filterCriteria = event.map(option => option.value.criterium.data.name);
  }

  ngOnInit() {
    const children2: SearchFilterCriteriaInterface.SearchFilterCriteriaInterface = {
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

    const children: SearchFilterCriteriaInterface = {
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
          children: children2
        }
      ]
    };

    this.selectFilter = {
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
          children: children
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
}

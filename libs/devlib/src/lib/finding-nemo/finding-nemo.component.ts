import { Component, OnInit, Type } from '@angular/core';
import {
  CredentialFixture,
  EduContentMetadataFixture,
  EduContentMetadataInterface,
  LearningAreaFixture
} from '@campus/dal';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesFixture,
  SearchResultItemInterface
} from '@campus/search';
import { PolpoResultItemComponent } from '../polpo-result-item/polpo-result-item.component';

@Component({
  selector: 'campus-finding-nemo',
  templateUrl: './finding-nemo.component.html',
  styleUrls: ['./finding-nemo.component.scss']
})
export class FindingNemoComponent implements OnInit {
  selectFilter: SearchFilterCriteriaInterface;
  resultItemComponent: Type<SearchResultItemInterface>;
  resultsPage: EduContentMetadataInterface[];

  constructor() {}

  ngOnInit() {
    this.resultItemComponent = PolpoResultItemComponent;
    this.resultsPage = [
      new EduContentMetadataFixture(),
      new EduContentMetadataFixture(),
      new EduContentMetadataFixture()
    ];

    const searchFilter = new SearchFilterCriteriaFixture(
      {
        name: 'selectFilter',
        label: 'select filter'
      },
      [
        new SearchFilterCriteriaValuesFixture({
          data: new LearningAreaFixture({
            id: 1,
            name: 'foo'
          })
        }),
        new SearchFilterCriteriaValuesFixture({
          data: new LearningAreaFixture({
            id: 2,
            name: 'bar'
          })
        })
      ]
    );

    this.selectFilter = {
      name: 'selectFilter',
      label: 'select filter',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [
        {
          data: new LearningAreaFixture({
            id: 1,
            name: 'foo'
          }),
          selected: false,
          prediction: 0,
          visible: true,
          child: {
            name: 'selectFilter',
            label: 'select filter',
            keyProperty: 'id',
            displayProperty: 'provider',
            values: [
              {
                data: new CredentialFixture(),
                selected: false,
                prediction: 0,
                visible: true
              }
            ]
          }
        },
        {
          data: new LearningAreaFixture({
            id: 2,
            name: 'bar'
          }),
          selected: false,
          prediction: 0,
          visible: true,
          child: null
        }
      ]
    };
  }

  onFilterSelectionChange(searchFilter: SearchFilterCriteriaInterface) {
    console.log(searchFilter);
  }
}

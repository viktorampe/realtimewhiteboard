import { Component, OnInit } from '@angular/core';
import { CredentialFixture, LearningAreaFixture } from '@campus/dal';
import { SearchFilterCriteriaInterface } from '@campus/search';

@Component({
  selector: 'campus-finding-nemo',
  templateUrl: './finding-nemo.component.html',
  styleUrls: ['./finding-nemo.component.scss']
})
export class FindingNemoComponent implements OnInit {
  public selectFilter: SearchFilterCriteriaInterface;
  public selectedFilterCriteria: SearchFilterCriteriaInterface;

  constructor() {}

  ngOnInit() {
    this.selectFilter = {
      name: 'selectFilter',
      label: 'select filter',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [
        {
          data: new LearningAreaFixture({
            id: 1,
            name: 'Aardrijkskunde'
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
                data: new CredentialFixture({ id: 1, provider: 'smartschool' }),
                selected: false,
                prediction: 0,
                visible: true
              },
              {
                data: new CredentialFixture({ id: 2, provider: 'google' }),
                selected: false,
                prediction: 0,
                visible: true
              },
              {
                data: new CredentialFixture({ id: 3, provider: 'facebook' }),
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
            name: 'Geschiedenis'
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
                data: new CredentialFixture({ id: 1, provider: 'smartschool' }),
                selected: false,
                prediction: 0,
                visible: true
              },
              {
                data: new CredentialFixture({ id: 2, provider: 'google' }),
                selected: false,
                prediction: 0,
                visible: true
              },
              {
                data: new CredentialFixture({ id: 3, provider: 'facebook' }),
                selected: false,
                prediction: 0,
                visible: true
              }
            ]
          }
        },
        {
          data: new LearningAreaFixture({
            id: 3,
            name: 'Wiskunde'
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
                data: new CredentialFixture({ id: 1, provider: 'smartschool' }),
                selected: false,
                prediction: 0,
                visible: true
              },
              {
                data: new CredentialFixture({ id: 2, provider: 'google' }),
                selected: false,
                prediction: 0,
                visible: true
              },
              {
                data: new CredentialFixture({ id: 3, provider: 'facebook' }),
                selected: false,
                prediction: 0,
                visible: true
              }
            ]
          }
        },
        {
          data: new LearningAreaFixture({
            id: 4,
            name: 'Informatica'
          }),
          selected: false,
          prediction: 0,
          visible: true,
          child: null
        },
        {
          data: new LearningAreaFixture({
            id: 5,
            name: 'Engels'
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
    this.selectedFilterCriteria = searchFilter;
  }
}

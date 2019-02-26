import { Component, OnInit } from '@angular/core';
import { CredentialFixture, LearningAreaFixture } from '@campus/dal';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesFixture
} from '@campus/search';

const mockBreadcrumbFilterCriteria: SearchFilterCriteriaInterface[] = [
  {
    name: 'breadCrumbFilter',
    label: 'koepels',
    keyProperty: 'id',
    displayProperty: 'name',
    values: [
      {
        data: {
          id: 1,
          name: 'Gemeenschapsonderwijs'
        },
        selected: true
      },
      {
        data: {
          id: 2,
          name: 'Officieel gesubsidieerd onderwijs'
        },
        selected: false
      },
      {
        data: {
          id: 3,
          name: 'Vrij gesubsidieerd onderwijs'
        },
        selected: false
      }
    ]
  },
  {
    name: 'breadCrumbFilter',
    label: 'Stromen',
    keyProperty: 'id',
    displayProperty: 'name',
    values: [
      {
        data: {
          id: 1,
          name: 'A-stroom'
        },
        selected: true
      },
      {
        data: {
          id: 2,
          name: 'ASO'
        },
        selected: false
      },
      {
        data: {
          id: 3,
          name: 'B-Stroom'
        },
        selected: false
      },
      {
        data: {
          id: 4,
          name: 'BSO'
        },
        selected: false
      }
    ]
  },
  {
    name: 'breadCrumbFilter',
    label: 'jaren',
    keyProperty: 'id',
    displayProperty: 'name',
    values: [
      {
        data: {
          id: 1,
          name: '1e jaar'
        },
        selected: true
      },
      {
        data: {
          id: 2,
          name: '2de jaar'
        },
        selected: false
      }
    ]
  },
  {
    name: 'breadCrumbFilter',
    label: 'richtingen',
    keyProperty: 'id',
    displayProperty: 'name',
    values: [
      {
        data: {
          id: 1,
          name: 'Economie'
        },
        selected: false
      },
      {
        data: {
          id: 2,
          name: 'Grieks'
        },
        selected: true
      },
      {
        data: {
          id: 2,
          name: 'Grieks-Latijn'
        },
        selected: false
      }
    ]
  }
];

@Component({
  selector: 'campus-finding-nemo',
  templateUrl: './finding-nemo.component.html',
  styleUrls: ['./finding-nemo.component.scss']
})
export class FindingNemoComponent implements OnInit {
  public selectFilter: SearchFilterCriteriaInterface;
  public selectedFilterCriteria: SearchFilterCriteriaInterface;

  breadCrumbFilterCriteria: SearchFilterCriteriaInterface[];

  constructor() {}

  ngOnInit() {
    this.selectFilter = new SearchFilterCriteriaFixture(
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
          }),
          selected: true
        })
      ]
    );

    this.selectFilter = new SearchFilterCriteriaFixture(
      { label: 'search filter' },
      [
        new SearchFilterCriteriaValuesFixture(
          {
            data: new LearningAreaFixture({
              id: 1,
              name: 'Aardrijkskunde'
            })
          },
          new SearchFilterCriteriaFixture(
            { keyProperty: 'id', displayProperty: 'provider' },
            [
              new SearchFilterCriteriaValuesFixture(
                {
                  data: new CredentialFixture({
                    id: 1,
                    provider: 'smartschool'
                  })
                },
                new SearchFilterCriteriaFixture(
                  { keyProperty: 'id', displayProperty: 'provider' },
                  [
                    new SearchFilterCriteriaValuesFixture(
                      {
                        data: new CredentialFixture({
                          id: 1,
                          provider: 'x'
                        })
                      },

                      new SearchFilterCriteriaFixture(
                        { keyProperty: 'id', displayProperty: 'provider' },
                        [
                          new SearchFilterCriteriaValuesFixture({
                            data: new CredentialFixture({
                              id: 1,
                              provider: 'xx'
                            })
                          }),
                          new SearchFilterCriteriaValuesFixture({
                            data: new CredentialFixture({
                              id: 2,
                              provider: 'xx'
                            })
                          }),
                          new SearchFilterCriteriaValuesFixture({
                            data: new CredentialFixture({
                              id: 3,
                              provider: 'xx'
                            })
                          })
                        ]
                      )
                    ),
                    new SearchFilterCriteriaValuesFixture({
                      data: new CredentialFixture({
                        id: 2,
                        provider: 'x'
                      })
                    }),
                    new SearchFilterCriteriaValuesFixture(
                      {
                        data: new CredentialFixture({
                          id: 3,
                          provider: 'x'
                        })
                      },
                      new SearchFilterCriteriaFixture(
                        { keyProperty: 'id', displayProperty: 'provider' },
                        [
                          new SearchFilterCriteriaValuesFixture({
                            data: new CredentialFixture({
                              id: 1,
                              provider: 'xy'
                            })
                          }),
                          new SearchFilterCriteriaValuesFixture({
                            data: new CredentialFixture({
                              id: 2,
                              provider: 'xy'
                            })
                          }),
                          new SearchFilterCriteriaValuesFixture(
                            {
                              data: new CredentialFixture({
                                id: 3,
                                provider: 'xy'
                              })
                            },
                            new SearchFilterCriteriaFixture(
                              {
                                keyProperty: 'id',
                                displayProperty: 'provider'
                              },
                              [
                                new SearchFilterCriteriaValuesFixture({
                                  data: new CredentialFixture({
                                    id: 1,
                                    provider: 'xyz'
                                  })
                                }),
                                new SearchFilterCriteriaValuesFixture({
                                  data: new CredentialFixture({
                                    id: 2,
                                    provider: 'xyz'
                                  })
                                }),
                                new SearchFilterCriteriaValuesFixture({
                                  data: new CredentialFixture({
                                    id: 3,
                                    provider: 'xyz'
                                  })
                                })
                              ]
                            )
                          )
                        ]
                      )
                    )
                  ]
                )
              ),
              new SearchFilterCriteriaValuesFixture({
                data: new CredentialFixture({ id: 2, provider: 'google' })
              })
            ]
          )
        )
      ]
    );
  }

  onFilterSelectionChange(searchFilter: SearchFilterCriteriaInterface[]) {
    this.breadCrumbFilterCriteria = searchFilter;
    console.log(searchFilter);
  }
  onChange(value: string) {
    console.log(value);
  }
}

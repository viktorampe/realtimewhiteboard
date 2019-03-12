import { inject, TestBed } from '@angular/core/testing';
import { YearApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { YearFixture } from './../+fixtures/Year.fixture';
import { YearService } from './year.service';
import { YearServiceInterface } from './year.service.interface';

describe('YearService', () => {
  let yearService: YearServiceInterface;
  let mockData$: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        YearService,
        {
          provide: YearApi,
          useValue: {
            find: () => mockData$
          }
        }
      ]
    });
    yearService = TestBed.get(YearService);
  });

  it('should be created', inject([YearService], (service: YearService) => {
    expect(service).toBeTruthy();
  }));

  it('should return years', () => {
    mockData$ = hot('-a-|', {
      a: [new YearFixture({ id: 1 }), new YearFixture({ id: 2 })]
    });
    expect(yearService.getAll()).toBeObservable(
      hot('-a-|', {
        a: [new YearFixture({ id: 1 }), new YearFixture({ id: 2 })]
      })
    );
  });
});

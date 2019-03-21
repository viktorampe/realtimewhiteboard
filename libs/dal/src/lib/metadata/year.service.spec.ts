import { inject, TestBed } from '@angular/core/testing';
import { EduContentBookApi, YearApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { of } from 'rxjs';
import { EduContentBookFixture } from '../+fixtures';
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
        },
        {
          provide: EduContentBookApi,
          useValue: {
            find: () => {}
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

  describe('getAllByMethodIds', () => {
    it('should return years, ordered by Id', () => {
      const eduContentApi = TestBed.get(EduContentBookApi);

      const mockYears = [
        new YearFixture({ id: 1, name: '1' }),
        new YearFixture({ id: 2, name: '2' }),
        new YearFixture({ id: 3, name: '3' }),
        new YearFixture({ id: 4, name: '4' }),
        new YearFixture({ id: 5, name: '5' }),
        new YearFixture({ id: 6, name: '6' })
      ];

      const mockData = [
        new EduContentBookFixture({
          id: 1,
          years: [mockYears[0], mockYears[1], mockYears[3]]
        }),
        new EduContentBookFixture({
          id: 1,
          years: [mockYears[0], mockYears[2]]
        })
      ];

      eduContentApi.find = jest.fn().mockReturnValue(of(mockData));

      // passed parameter is not evaluated -> mocks
      expect(yearService.getAllByMethodIds(null)).toBeObservable(
        hot('(a|)', {
          a: [mockYears[0], mockYears[1], mockYears[2], mockYears[3]]
        })
      );
    });
  });
});

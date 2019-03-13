import { inject, TestBed } from '@angular/core/testing';
import { SearchStateInterface } from '@campus/search';
import { EduContentApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { EduContentService } from './edu-content.service';
import { EduContentServiceInterface } from './edu-content.service.interface';

describe('EduContentService', () => {
  let service: EduContentServiceInterface;
  let mockGetData$: any;
  let mockSearch$: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EduContentService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockGetData$
          }
        },
        {
          provide: EduContentApi,
          useValue: {
            search: () => mockSearch$
          }
        }
      ]
    });
    service = TestBed.get(EduContentService);
  });

  it('should be created and available via DI', inject(
    [EduContentService],
    (eduContentStervice: EduContentService) => {
      expect(eduContentStervice).toBeTruthy();
    }
  ));

  it('should return eduContents', async () => {
    mockGetData$ = hot('-a-|', {
      a: { eduContents: [{ id: 1, type: 'file' }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 1, type: 'file' }]
      })
    );
  });
  it('should return SearchResultInterface when search is called', async () => {
    mockSearch$ = hot('-a-|', {
      a: {
        results: [
          {
            count: 29038,
            results: [],
            filterCriteriaPredictions: new Map<
              string,
              Map<string | number, number>
            >()
          }
        ]
      }
    });
    expect(service.search({} as SearchStateInterface)).toBeObservable(
      hot('-a-|', {
        a: [
          {
            count: 29038,
            results: [],
            filterCriteriaPredictions: new Map<
              string,
              Map<string | number, number>
            >()
          }
        ]
      })
    );
  });
  // it('should return a string array if autoComplete is called', async () => {
  //   mockGetData$ = hot('-a-|', {
  //     a: { eduContents: [{ id: 1, type: 'file' }] }
  //   });
  //   expect(service.autoComplete()).toBeObservable(
  //     hot('-a-|', {
  //       a: [{ id: 1, type: 'file' }]
  //     })
  //   );
  // });
});

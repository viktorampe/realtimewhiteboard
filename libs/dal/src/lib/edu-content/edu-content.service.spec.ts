import { inject, TestBed } from '@angular/core/testing';
import { SearchStateInterface } from '.';
import { MapObjectConversionService } from '@campus/utils';
import { EduContentApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { EduContentService } from './edu-content.service';
import { EduContentServiceInterface } from './edu-content.service.interface';

describe('EduContentService', () => {
  let service: EduContentServiceInterface;
  let eduContentApi: EduContentApi;
  let mockData$: any;
  let mockEduContents$: any;
  let mockSearch$: any;
  let mockAutocomplete$: any;
  const mockSearchState: SearchStateInterface = {
    searchTerm: 'search the term',
    sort: 'sort string',
    from: 83,
    filterCriteriaSelections: new Map<string, (number | string)[]>([
      ['key here', [3, 3, 'klsdk', 5, '3lde', 5, 0]]
    ])
  };
  const convertedMockSearchStateInput = {
    searchTerm: 'search the term',
    sort: 'sort string',
    from: 83,
    filterCriteriaSelections: { 'key here': [3, 3, 'klsdk', 5, '3lde', 5, 0] }
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        EduContentService,
        MapObjectConversionService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        },
        {
          provide: EduContentApi,
          useValue: {
            getGeneralEduContentForBookId: () => mockEduContents$,
            search: () => mockSearch$,
            autocomplete: () => mockAutocomplete$
          }
        }
      ]
    });
    service = TestBed.get(EduContentService);
    eduContentApi = TestBed.get(EduContentApi);
  });

  it('should be created and available via DI', inject(
    [EduContentService],
    (eduContentStervice: EduContentService) => {
      expect(eduContentStervice).toBeTruthy();
    }
  ));

  describe('getAllForUser', () => {
    it('should return eduContents', () => {
      mockData$ = hot('-a-|', {
        a: { eduContents: [{ id: 1, type: 'file' }] }
      });

      expect(service.getAllForUser(1)).toBeObservable(
        hot('-a-|', {
          a: [{ id: 1, type: 'file' }]
        })
      );
    });
  });

  describe('getGeneralEduContentForBookId', () => {
    it('should return general eduContents', () => {
      const eduContents = [{ id: 1, type: 'file' }];
      mockEduContents$ = hot('-a-|', {
        a: eduContents
      });

      expect(service.getGeneralEduContentForBookId(1)).toBeObservable(
        hot('-a-|', {
          a: eduContents
        })
      );
    });
  });

  describe('search', () => {
    it('should return SearchResultInterface', () => {
      const apiSearchSpy = jest.spyOn(eduContentApi, 'search');
      mockSearch$ = hot('-a-|', {
        a: {
          count: 29038,
          results: [],
          filterCriteriaPredictions: { someKey: { 2: 903 } }
        }
      });

      expect(service.search(mockSearchState)).toBeObservable(
        hot('-a-|', {
          a: {
            count: 29038,
            results: [],
            filterCriteriaPredictions: new Map<
              string,
              Map<string | number, number>
            >([['someKey', new Map<number, number>([[2, 903]])]])
          }
        })
      );

      expect(apiSearchSpy).toHaveBeenCalledWith(convertedMockSearchStateInput);
    });
  });

  describe('autocomplete', () => {
    it('should return a string array', () => {
      const apiAutocompleteSpy = jest.spyOn(eduContentApi, 'autocomplete');
      mockAutocomplete$ = hot('-a-|', {
        a: ['array', 'of', 'strings']
      });

      expect(service.autoComplete(mockSearchState)).toBeObservable(
        hot('-a-|', {
          a: ['array', 'of', 'strings']
        })
      );

      expect(apiAutocompleteSpy).toHaveBeenCalledWith(
        convertedMockSearchStateInput
      );
    });
  });
});

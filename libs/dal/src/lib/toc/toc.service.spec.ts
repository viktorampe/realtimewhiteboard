import { inject, TestBed } from '@angular/core/testing';
import {
  EduContentBookApi,
  EduContentTOCApi
} from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { of } from 'rxjs';
import {
  EduContentBookFixture,
  EduContentTOCEduContentFixture,
  EduContentTOCFixture,
  YearFixture
} from '../+fixtures';
import { TocService } from './toc.service';
import { TocServiceInterface } from './toc.service.interface';

describe('TocService', () => {
  let service: TocServiceInterface;
  let eduContentBookApi: EduContentBookApi;
  let eduContentTOCApi: EduContentTOCApi;

  let mockData$: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TocService,
        {
          provide: EduContentTOCApi,
          useValue: {
            tree: () => mockData$,
            find: () => mockData$
          }
        },
        {
          provide: EduContentBookApi,
          useValue: {
            find: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(TocService);
    eduContentBookApi = TestBed.get(EduContentBookApi);
    eduContentTOCApi = TestBed.get(EduContentTOCApi);
  });

  it('should be created', inject([TocService], (srv: TocServiceInterface) => {
    expect(srv).toBeTruthy();
  }));

  describe('getBooksByYearAndMethods()', () => {
    it('should get books by year and number', () => {
      mockData$ = hot('-a|', {
        a: [
          { years: [{ name: '6', id: 6 }] },
          { years: [{ name: '5', id: 5 }] }
        ]
      });

      const spy = jest.spyOn(eduContentBookApi, 'find');
      const response = service.getBooksByYearAndMethods(1, [2, 3]);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        where: { methodId: { inq: [2, 3] } },
        include: [{ relation: 'years', scope: { where: { id: 1 } } }]
      });
      expect(response).toBeObservable(
        hot('-a|', {
          a: [
            { years: [{ name: '6', id: 6 }] },
            { years: [{ name: '5', id: 5 }] }
          ]
        })
      );
    });
    it('should filter out books without the provided year', () => {
      mockData$ = hot('-a|', {
        a: [{ years: [{ name: '5', id: 5 }] }, { years: [] }]
      });

      const spy = jest.spyOn(eduContentBookApi, 'find');
      const response = service.getBooksByYearAndMethods(1, [2, 3]);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        where: { methodId: { inq: [2, 3] } },
        include: [{ relation: 'years', scope: { where: { id: 1 } } }]
      });
      expect(response).toBeObservable(
        hot('-a|', { a: [{ years: [{ name: '5', id: 5 }] }] })
      );
    });
  });

  describe('getTree()', () => {
    it('should get the tree for the provided book', () => {
      mockData$ = hot('-a|', {
        a: { results: { foo: 'bar' } }
      });

      const spy = jest.spyOn(eduContentTOCApi, 'tree');
      const response = service.getTree(1);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(response).toBeObservable(
        hot('-a|', { a: { results: { foo: 'bar' } } })
      );
    });
  });

  describe('getTocsForBookId()', () => {
    it('should get a list of tocs for the provided book', () => {
      const tocs = [new EduContentTOCFixture(), new EduContentTOCFixture()];
      mockData$ = hot('-a|', {
        a: tocs
      });

      const spy = jest.spyOn(eduContentTOCApi, 'find');
      const response = service.getTocsForBookId(1);
      const expectedFilter = {
        where: { treeId: 1 }
      };

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(expectedFilter);
      expect(response).toBeObservable(
        hot('-a|', {
          a: tocs
        })
      );
    });
  });

  describe('getBooksByMethodIds', () => {
    it('should return books', () => {
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
      expect(service.getBooksByMethodIds(null)).toBeObservable(
        hot('(a|)', {
          a: mockData
        })
      );
    });
  });

  describe('getBooksByIds', () => {
    it('should return books', () => {
      const eduContentApi = TestBed.get(EduContentBookApi);

      const mockData = [
        new EduContentBookFixture({ id: 1 }),
        new EduContentBookFixture({ id: 2 }),
        new EduContentBookFixture({ id: 3 })
      ];

      eduContentApi.find = jest.fn().mockReturnValue(of(mockData));

      // passed parameter is not evaluated -> mocks
      expect(service.getBooksByIds([1, 2, 3])).toBeObservable(
        hot('(a|)', {
          a: mockData
        })
      );
    });
  });

  describe('getEduContentTocEduContentForBookId', () => {
    it('should return EduContentTocEduContents', () => {
      const mockData = [
        new EduContentTOCEduContentFixture({
          id: '1-1',
          eduContentId: 1,
          eduContentTOCId: 1
        }),
        new EduContentTOCEduContentFixture({
          id: '1-2',
          eduContentId: 1,
          eduContentTOCId: 2
        })
      ];
      // TODO: Replace with function call when SDK update is published!
      eduContentTOCApi[
        'getEduContentTocsWithEduContentIdsRemote'
      ] = jest.fn().mockReturnValue(of(mockData));
      const response = service.getEduContentTocEduContentForBookId(1);
      expect(response).toBeObservable(
        hot('(a|)', {
          a: mockData
        })
      );
    });
  });
});

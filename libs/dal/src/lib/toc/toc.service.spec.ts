import { inject, TestBed } from '@angular/core/testing';
import {
  EduContentBookApi,
  EduContentTOCApi
} from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
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
            tree: () => mockData$
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
        a: { results: { foo: 'bar' } }
      });

      const spy = jest.spyOn(eduContentBookApi, 'find');
      const response = service.getBooksByYearAndMethods(1, [2, 3]);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        where: { methodId: { inq: [2, 3] } },
        include: [{ relation: 'years', scope: { where: { id: 1 } } }]
      });
      expect(response).toBeObservable(
        hot('-a|', { a: { results: { foo: 'bar' } } })
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
});

import { inject, TestBed } from '@angular/core/testing';
import { BundleApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { UnlockedContent } from '../+models';
import { BundleService } from './bundle.service';
import { BundleServiceInterface } from './bundle.service.interface';

describe('BundleService', () => {
  let service: BundleServiceInterface;
  let bundleApi: BundleApi;
  let mockGetData$: Observable<object>;
  let mockLinkEduContentData$: Observable<UnlockedContent[]>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BundleService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockGetData$
          }
        },
        {
          provide: BundleApi,
          useValue: {
            linkEduContent: () => mockLinkEduContentData$
          }
        }
      ]
    });
    service = TestBed.get(BundleService);
    bundleApi = TestBed.get(BundleApi);
  });

  it('should be created and available via DI', inject(
    [BundleService],
    (bundleService: BundleService) => {
      expect(bundleService).toBeTruthy();
    }
  ));

  it('should return bundles', () => {
    mockGetData$ = hot('-a-|', {
      a: { bundles: [{ id: 12331 }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 12331 }]
      })
    );
  });
  describe('linkEduContent', () => {
    it('should return the link result', () => {
      const mockLinkEduContentData = [
        {
          index: 10000,
          exception: false,
          id: 634,
          eduContentId: 5,
          teacherId: 186,
          bundleId: 1,
          userContentId: null
        },
        {
          index: 10000,
          exception: false,
          id: 635,
          eduContentId: 6,
          teacherId: 186,
          bundleId: 1,
          userContentId: null
        },
        {
          index: 10000,
          exception: false,
          id: 636,
          eduContentId: 7,
          teacherId: 186,
          bundleId: 1,
          userContentId: null
        }
      ];
      mockLinkEduContentData$ = hot('-a-|', {
        a: mockLinkEduContentData
      });
      const spy = jest.spyOn(bundleApi, 'linkEduContent');
      expect(service.linkEduContent(1, [5, 6, 7])).toBeObservable(
        hot('-a-|', {
          a: mockLinkEduContentData
        })
      );
      expect(spy).toHaveBeenCalledWith(1, [5, 6, 7]);
    });
  });
});

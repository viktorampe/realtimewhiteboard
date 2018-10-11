import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { BundleService } from './bundle.service';
import { BundleServiceInterface } from './bundle.service.interface';

describe('BundleService', () => {
  let service: BundleServiceInterface;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BundleService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(BundleService);
  });

  it('should be created and available via DI', inject(
    [BundleService],
    (bundleService: BundleService) => {
      expect(bundleService).toBeTruthy();
    }
  ));

  it('should return bundles', () => {
    mockData$ = hot('-a-|', {
      a: { bundles: [{ id: 12331 }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 12331 }]
      })
    );
  });
});

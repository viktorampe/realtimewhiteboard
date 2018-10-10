import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { BundlesService } from './bundles.service';
import { BundlesServiceInterface } from './bundles.service.interface';

describe('BundlesService', () => {
  let service: BundlesServiceInterface;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BundlesService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(BundlesService);
  });

  it('should be created and available via DI', inject(
    [BundlesService],
    (bundlesService: BundlesService) => {
      expect(bundlesService).toBeTruthy();
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

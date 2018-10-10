import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Subject } from 'rxjs';
import { BundleInterface } from '../+models';
import { BundlesService } from './bundles.service';
import { BundlesServiceInterface } from './bundles.service.interface';

describe('BundlesService', () => {
  let service: BundlesServiceInterface;
  const mockData$: Subject<object> = new Subject();

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

  it('should return bundleContents', async () => {
    service.getAllForUser(1).subscribe(res => {
      expect(res).toEqual([<BundleInterface>{ id: 1 }]);
    });
    // emit after subscription!
    mockData$.next({ bundleContents: [{ id: 1 }] });
  });
});

import { inject, TestBed } from '@angular/core/testing';
import { BundleApi } from '@diekeure/polpo-api-angular-sdk';
import { BundleService } from './bundle.service';

describe('BundleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BundleService,
        { provide: BundleApi, useClass: class MockBundleApi {} }
      ]
    });
  });

  it('should be created', inject([BundleService], (service: BundleService) => {
    expect(service).toBeTruthy();
  }));
});

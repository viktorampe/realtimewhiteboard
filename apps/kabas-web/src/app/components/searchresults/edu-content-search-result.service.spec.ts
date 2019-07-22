import { inject, TestBed } from '@angular/core/testing';
import { DalState, getStoreModuleForFeatures } from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { EduContentSearchResultItemService } from './edu-content-search-result.service';
import { EduContentSearchResultItemServiceInterface } from './edu-content-search-result.service.interface';

describe('EduContentSearchResultItemService', () => {
  let eduContentSearchResultItemService: EduContentSearchResultItemServiceInterface;
  let store: Store<DalState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), ...getStoreModuleForFeatures([])],
      providers: [EduContentSearchResultItemService, Store]
    });

    eduContentSearchResultItemService = TestBed.get(
      EduContentSearchResultItemService
    );

    store = TestBed.get(Store);
  });

  it('should be created', inject(
    [EduContentSearchResultItemService],
    (service: EduContentSearchResultItemService) => {
      expect(service).toBeTruthy();
    }
  ));
});

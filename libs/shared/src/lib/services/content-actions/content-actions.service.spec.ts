import { inject, TestBed } from '@angular/core/testing';
import { DalState, getStoreModuleForFeatures } from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { ContentActionsService } from './edu-content-search-result.service';
import { ContentActionsServiceInterface } from './edu-content-search-result.service.interface';

describe('ContentActionsServiceInterface', () => {
  let eduContentSearchResultItemService: ContentActionsServiceInterface;
  let store: Store<DalState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), ...getStoreModuleForFeatures([])],
      providers: [ContentActionsService, Store]
    });

    eduContentSearchResultItemService = TestBed.get(ContentActionsService);

    store = TestBed.get(Store);
  });

  it('should be created', inject(
    [ContentActionsService],
    (service: ContentActionsService) => {
      expect(service).toBeTruthy();
    }
  ));
});

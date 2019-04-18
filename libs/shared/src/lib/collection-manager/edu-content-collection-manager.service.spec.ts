import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import {
  COLLECTION_MANAGER_SERVICE_TOKEN,
  EduContentCollectionManagerService
} from './edu-content-collection-manager.service';

describe('EduContentCollectionManagerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        Store,
        { provide: COLLECTION_MANAGER_SERVICE_TOKEN, useValue: {} }
      ]
    })
  );

  it('should be created', () => {
    const service: EduContentCollectionManagerService = TestBed.get(
      EduContentCollectionManagerService
    );
    expect(service).toBeTruthy();
  });
});

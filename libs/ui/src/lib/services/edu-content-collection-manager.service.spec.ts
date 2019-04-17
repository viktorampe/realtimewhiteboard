import { TestBed } from '@angular/core/testing';
import { EduContentCollectionManagerService } from './edu-content-collection-manager.service';

describe('EduContentCollectionManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EduContentCollectionManagerService = TestBed.get(
      EduContentCollectionManagerService
    );
    expect(service).toBeTruthy();
  });
});

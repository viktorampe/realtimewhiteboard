import { TestBed } from '@angular/core/testing';
import { OpenStaticContentService } from './open-static-content-service.service';

describe('OpenStaticContentServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpenStaticContentService = TestBed.get(
      OpenStaticContentService
    );
    expect(service).toBeTruthy();
  });
});

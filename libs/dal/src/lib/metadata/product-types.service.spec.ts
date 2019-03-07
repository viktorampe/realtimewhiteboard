import { TestBed } from '@angular/core/testing';

import { ProductTypesService } from './product-types.service';

describe('ProductTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductTypesService = TestBed.get(ProductTypesService);
    expect(service).toBeTruthy();
  });
});

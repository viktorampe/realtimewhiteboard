import { TestBed } from '@angular/core/testing';
import { ProductTypeService } from './product-type.service';

describe('ProductTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductTypeService = TestBed.get(ProductTypeService);
    expect(service).toBeTruthy();
  });
});

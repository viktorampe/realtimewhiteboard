import { inject, TestBed } from '@angular/core/testing';
import { EduContentProductTypeApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { EduContentProductTypeFixture } from './../+fixtures/EduContentProductType.fixture';
import { ProductTypeService } from './product-type.service';
import { ProductTypeServiceInterface } from './product-type.service.interface';

describe('ProductTypesService', () => {
  let productTypeService: ProductTypeServiceInterface;
  let mockData$: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductTypeService,
        {
          provide: EduContentProductTypeApi,
          useValue: {
            find: () => mockData$
          }
        }
      ]
    });
    productTypeService = TestBed.get(ProductTypeService);
  });

  it('should be created', inject(
    [ProductTypeService],
    (service: ProductTypeService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should return productTypes', async () => {
    mockData$ = hot('-a-|', {
      a: [
        new EduContentProductTypeFixture({ id: 1 }),
        new EduContentProductTypeFixture({ id: 2 })
      ]
    });
    expect(productTypeService.getAll()).toBeObservable(
      hot('-a-|', {
        a: [
          new EduContentProductTypeFixture({ id: 1 }),
          new EduContentProductTypeFixture({ id: 2 })
        ]
      })
    );
  });
});

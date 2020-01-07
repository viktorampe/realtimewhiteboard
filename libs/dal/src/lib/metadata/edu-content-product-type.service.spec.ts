import { inject, TestBed } from '@angular/core/testing';
import { EduContentProductTypeApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { EduContentProductTypeFixture } from '../+fixtures/EduContentProductType.fixture';
import { EduContentProductTypeService } from './edu-content-product-type.service';
import { EduContentProductTypeServiceInterface } from './edu-content-product-type.service.interface';

describe('EduContentProductTypeService', () => {
  let eduContentProductTypeService: EduContentProductTypeServiceInterface;
  let mockData$: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EduContentProductTypeService,
        {
          provide: EduContentProductTypeApi,
          useValue: {
            find: () => mockData$
          }
        }
      ]
    });
    eduContentProductTypeService = TestBed.get(EduContentProductTypeService);
  });

  it('should be created', inject(
    [EduContentProductTypeService],
    (service: EduContentProductTypeService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should return EduContentProductTypes', async () => {
    mockData$ = hot('-a-|', {
      a: [
        new EduContentProductTypeFixture({ id: 1 }),
        new EduContentProductTypeFixture({ id: 2 })
      ]
    });
    expect(eduContentProductTypeService.getAll()).toBeObservable(
      hot('-a-|', {
        a: [
          new EduContentProductTypeFixture({ id: 1 }),
          new EduContentProductTypeFixture({ id: 2 })
        ]
      })
    );
  });
});

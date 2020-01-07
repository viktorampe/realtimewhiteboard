import { inject, TestBed } from '@angular/core/testing';
import { SchoolTypeApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { SchoolTypeFixture } from './../+fixtures/SchoolType.fixture';
import { SchoolTypeService } from './school-type.service';
import { SchoolTypeServiceInterface } from './school-type.service.interface';

describe('SchoolTypeService', () => {
  let schoolTypeService: SchoolTypeServiceInterface;
  let mockData$: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SchoolTypeService,
        {
          provide: SchoolTypeApi,
          useValue: {
            find: () => mockData$
          }
        }
      ]
    });
    schoolTypeService = TestBed.get(SchoolTypeService);
  });

  it('should be created', inject(
    [SchoolTypeService],
    (service: SchoolTypeService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should return schoolTypes', () => {
    mockData$ = hot('-a-|', {
      a: [new SchoolTypeFixture({ id: 1 }), new SchoolTypeFixture({ id: 2 })]
    });
    expect(schoolTypeService.getAll()).toBeObservable(
      hot('-a-|', {
        a: [new SchoolTypeFixture({ id: 1 }), new SchoolTypeFixture({ id: 2 })]
      })
    );
  });
});

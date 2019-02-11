import { inject, TestBed } from '@angular/core/testing';
import { MethodApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { MethodFixture } from '../+fixtures';
import { MethodService } from './method.service';
import { MethodServiceInterface } from './method.service.interface';

describe('MethodService', () => {
  let methodService: MethodServiceInterface;
  let mockData$: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MethodService,
        {
          provide: MethodApi,
          useValue: {
            find: () => mockData$
          }
        }
      ]
    });
    methodService = TestBed.get(MethodService);
  });

  it('should be created', inject([MethodService], (service: MethodService) => {
    expect(service).toBeTruthy();
  }));

  it('should return methods', async () => {
    mockData$ = hot('-a-|', {
      a: [new MethodFixture({ id: 1 }), new MethodFixture({ id: 2 })]
    });
    expect(methodService.getAll()).toBeObservable(
      hot('-a-|', {
        a: [new MethodFixture({ id: 1 }), new MethodFixture({ id: 2 })]
      })
    );
  });
});

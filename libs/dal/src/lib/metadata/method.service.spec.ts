import { inject, TestBed } from '@angular/core/testing';
import { MethodApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { MethodFixture } from '../+fixtures';
import { MethodService } from './method.service';
import { MethodServiceInterface } from './method.service.interface';

describe('MethodService', () => {
  let methodService: MethodServiceInterface;
  let mockData$: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        MethodService,
        {
          provide: MethodApi,
          useValue: {
            find: () => mockData$
          }
        },
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    methodService = TestBed.get(MethodService);
  });

  it('should be created', inject([MethodService], (service: MethodService) => {
    expect(service).toBeTruthy();
  }));

  describe('getAll', () => {
    it('should return methods', async () => {
      mockData$ = hot('-a-|', {
        a: {
          methods: [new MethodFixture({ id: 1 }), new MethodFixture({ id: 2 })]
        }
      });

      expect(methodService.getAllForUser(1)).toBeObservable(
        hot('-a-|', {
          a: [new MethodFixture({ id: 1 }), new MethodFixture({ id: 2 })]
        })
      );
    });
  });

  describe('getAllowedMethodIds', () => {
    it('should return method ids', async () => {
      const allowedMethods = [1, 2];
      mockData$ = hot('-a-|', {
        a: {
          allowedMethods
        }
      });

      expect(methodService.getAllowedMethodIds(1)).toBeObservable(
        hot('-a-|', {
          a: allowedMethods
        })
      );
    });
  });
});

import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { ClassGroupServiceInterface } from '.';
import { ClassGroupFixture } from '../+fixtures';
import { ClassGroupService } from './class-group.service';

describe('ClassGroupService', () => {
  let service: ClassGroupServiceInterface;
  let mockData$: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ClassGroupService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(ClassGroupService);
  });

  it('should be created and available via DI', inject(
    [ClassGroupService],
    (classGroupService: ClassGroupService) => {
      expect(classGroupService).toBeTruthy();
    }
  ));

  describe('getAllForUser', () => {
    it('should return classGroups', () => {
      const classGroups = [new ClassGroupFixture()];
      mockData$ = hot('-a-|', {
        a: { classGroups }
      });

      expect(service.getAllForUser(1)).toBeObservable(
        hot('-a-|', {
          a: classGroups
        })
      );
    });
  });
});

import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { UserLessonService } from '.';
import { UserLessonServiceInterface } from './user-lesson.service.interface';

describe('UserLessonService', () => {
  let service: UserLessonServiceInterface;
  let mockData$: any;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        UserLessonService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(UserLessonService);
  });

  it('should be created and available via DI', inject(
    [UserLessonService],
    (userLessonService: UserLessonService) => {
      expect(userLessonService).toBeTruthy();
    }
  ));

  describe('getAllForUser', () => {
    it('should return userLessons', async () => {
      mockData$ = hot('-a-|', {
        a: { userLessons: [{ id: 666 }] }
      });
      expect(service.getAllForUser(1)).toBeObservable(
        hot('-a-|', {
          a: [{ id: 666 }]
        })
      );
    });
  });
});

import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { cold, hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { UserLessonService } from '.';
import { UserLessonFixture } from '../+fixtures/UserLesson.fixture';
import { UserLessonServiceInterface } from './user-lesson.service.interface';

describe('UserLessonService', () => {
  let service: UserLessonServiceInterface;
  let mockData$: any;
  let personApi: PersonApi;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        UserLessonService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$,
            createUserLessons: () => mockData$
          }
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(UserLessonService);
    personApi = TestBed.get(PersonApi);
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

  describe('createForUser', () => {
    const userId = 1;
    const mockNewUserLesson = new UserLessonFixture({ id: undefined });
    const mockReturnUserLesson = new UserLessonFixture({ id: undefined });

    it('should call the api and return the response', () => {
      mockData$ = cold('a|', { a: mockReturnUserLesson });
      jest.spyOn(personApi, 'createUserLessons').mockReturnValue(mockData$);

      const response = service.createForUser(userId, mockNewUserLesson);

      expect(personApi.createUserLessons).toHaveBeenCalledWith(
        userId,
        mockNewUserLesson
      );
      expect(response).toBeObservable(cold('a|', { a: mockReturnUserLesson }));
    });
  });
});

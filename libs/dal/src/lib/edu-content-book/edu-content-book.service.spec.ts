import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { EduContentBookServiceInterface } from '.';
import { EduContentBookFixture } from '../+fixtures';
import { EduContentBookService } from './edu-content-book.service';

describe('EduContentBookService', () => {
  let service: EduContentBookServiceInterface;
  let mockData$: any;
  let personApi: PersonApi;

  const userId = 1;
  const mockBook = new EduContentBookFixture({
    id: 42
  });

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        EduContentBookService,
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
    service = TestBed.get(EduContentBookService);
    personApi = TestBed.get(PersonApi);
  });

  it('should be created and available via DI', inject(
    [EduContentBookService],
    (eduContentBookService: EduContentBookService) => {
      expect(eduContentBookService).toBeTruthy();
    }
  ));

  describe('getAllForUser', () => {
    it('should return eduContentBooks', async () => {
      mockData$ = hot('-a-|', {
        a: { allowedEduContentBooks: [mockBook] }
      });
      expect(service.getAllForUser(userId)).toBeObservable(
        hot('-a-|', {
          a: [mockBook]
        })
      );
    });
  });
});

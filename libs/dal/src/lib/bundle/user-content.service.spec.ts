import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { Observable } from 'rxjs';
import { UserContentService } from './user-content.service';
import { UserContentServiceInterface } from './user-content.service.interface';

describe('UserContentService', () => {
  let service: UserContentServiceInterface;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserContentService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(UserContentService);
  });

  it('should be created and available via DI', inject(
    [UserContentService],
    (userContentsService: UserContentService) => {
      expect(userContentsService).toBeTruthy();
    }
  ));

  it('should return userContents', () => {
    mockData$ = hot('-a-|', {
      a: {
        userContents: [
          {
            id: 1,
            name: 'name',
            description: 'description',
            type: 'type'
          }
        ]
      }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [
          {
            id: 1,
            name: 'name',
            description: 'description',
            type: 'type'
          }
        ]
      })
    );
  });
});

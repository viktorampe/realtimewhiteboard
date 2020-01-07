import { TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { Observable } from 'rxjs';
import { GroupServiceInterface } from '.';
import { GroupService } from './group.service';

describe('GroupService', () => {
  let service: GroupServiceInterface;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GroupService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(GroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return groups', () => {
    mockData$ = hot('-a-|', {
      a: { groups: [{ id: 12331 }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 12331 }]
      })
    );
  });
});

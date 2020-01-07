import { inject, TestBed } from '@angular/core/testing';
import { PersonApi, UnlockedContentApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { Observable } from 'rxjs';
import { UnlockedContentService } from './unlocked-content.service';
import { UnlockedContentServiceInterface } from './unlocked-content.service.interface';

describe('UnlockedContentService', () => {
  let service: UnlockedContentServiceInterface;
  let mockGetData$: Observable<object>;
  let mockDeleteById$: Observable<boolean>;
  const mockPersonApi = {
    getData: jest.fn().mockImplementation(() => mockGetData$)
  };
  const mockUnlockedContentApi = {
    deleteById: jest.fn().mockImplementation(() => mockDeleteById$)
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new UnlockedContentService(
      mockPersonApi as any,
      mockUnlockedContentApi as any
    );
  });

  describe('Dependency injection', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          UnlockedContentService,
          { provide: PersonApi, useValue: {} },
          { provide: UnlockedContentApi, useValue: {} }
        ]
      });
      service = TestBed.get(UnlockedContentService);
    });

    it('should be created and available via DI', inject(
      [UnlockedContentService],
      (unlockedContentService: UnlockedContentService) => {
        expect(unlockedContentService).toBeTruthy();
      }
    ));
  });

  it('should return unlockedContents', () => {
    mockGetData$ = hot('-a-|', {
      a: {
        unlockedContents: [
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

  it('should remove a single unlockedContent', () => {
    mockDeleteById$ = hot('-a-|', {
      a: true
    });
    expect(service.remove(1)).toBeObservable(
      hot('-a-|', {
        a: true
      })
    );

    expect(mockUnlockedContentApi.deleteById).toHaveBeenCalledWith(1);
  });

  it('should remove multiple unlockedContents', () => {
    mockDeleteById$ = hot('-a-|', {
      a: true
    });
    expect(service.removeAll([1, 2, 3])).toBeObservable(
      hot('---(a|)', {
        a: true
      })
    );

    expect(mockUnlockedContentApi.deleteById).toHaveBeenCalledWith(3);
    expect(mockUnlockedContentApi.deleteById).toHaveBeenCalledWith(2);
    expect(mockUnlockedContentApi.deleteById).toHaveBeenCalledWith(1);
  });
});

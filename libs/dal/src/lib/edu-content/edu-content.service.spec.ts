import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { EduContentService } from './edu-content.service';
import { EduContentServiceInterface } from './edu-content.service.interface';

describe('EduContentService', () => {
  let service: EduContentServiceInterface;
  let mockData$: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EduContentService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(EduContentService);
  });

  it('should be created and available via DI', inject(
    [EduContentService],
    (eduContentStervice: EduContentService) => {
      expect(eduContentStervice).toBeTruthy();
    }
  ));

  it('should return eduContents', () => {
    mockData$ = hot('-a-|', {
      a: { eduContents: [{ id: 1, type: 'file' }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 1, type: 'file' }]
      })
    );
  });
});

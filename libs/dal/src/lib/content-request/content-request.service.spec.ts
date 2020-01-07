import { inject, TestBed } from '@angular/core/testing';
import { EduContentApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { ContentRequestService } from './content-request.service';
import { ContentRequestServiceInterface } from './content-request.service.interface';

describe('ContentRequestService', () => {
  let service: ContentRequestServiceInterface;
  let mockData$: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContentRequestService,
        {
          provide: EduContentApi,
          useValue: {
            requestURLRemote: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(ContentRequestService);
  });

  it('should be created', inject(
    [ContentRequestService],
    (contentRequestService: ContentRequestService) => {
      expect(contentRequestService).toBeTruthy();
    }
  ));

  it('should return a temp url', async () => {
    mockData$ = hot('-a-|', { a: { url: 'tempUrl' } });
    expect(service.requestUrl(1)).toBeObservable(
      hot('-a-|', {
        a: 'tempUrl'
      })
    );
  });
});

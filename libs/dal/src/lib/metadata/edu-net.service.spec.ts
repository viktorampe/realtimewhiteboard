import { inject, TestBed } from '@angular/core/testing';
import { EduNetApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { EduNetFixture } from './../+fixtures/EduNet.fixture';
import { EduNetService } from './edu-net.service';
import { EduNetServiceInterface } from './edu-net.service.interface';

describe('EduNetService', () => {
  let eduNetService: EduNetServiceInterface;
  let mockData$: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EduNetService,
        {
          provide: EduNetApi,
          useValue: {
            find: () => mockData$
          }
        }
      ]
    });
    eduNetService = TestBed.get(EduNetService);
  });

  it('should be created', inject([EduNetService], (service: EduNetService) => {
    expect(service).toBeTruthy();
  }));

  it('should return eduNets', async () => {
    mockData$ = hot('-a-|', {
      a: [new EduNetFixture({ id: 1 }), new EduNetFixture({ id: 2 })]
    });
    expect(eduNetService.getAll()).toBeObservable(
      hot('-a-|', {
        a: [new EduNetFixture({ id: 1 }), new EduNetFixture({ id: 2 })]
      })
    );
  });
});

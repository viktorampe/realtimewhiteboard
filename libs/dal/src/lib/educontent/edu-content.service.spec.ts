import { inject, TestBed } from '@angular/core/testing';
import { EduContentApi } from '@diekeure/polpo-api-angular-sdk';
import { EduContentService } from './edu-content.service';

describe('EduContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EduContentService, { provide: EduContentApi, useValue: {} }]
    });
  });

  it('should be created', inject(
    [EduContentService],
    (service: EduContentService) => {
      expect(service).toBeTruthy();
    }
  ));
});

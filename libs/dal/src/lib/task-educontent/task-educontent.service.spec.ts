import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { TaskEducontentService } from './task-educontent.service';

class MockPersonApi {}

describe('TaskEducontentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskEducontentService,
        { provide: PersonApi, useClass: MockPersonApi }
      ]
    });
  });

  it('should be created', inject(
    [TaskEducontentService],
    (service: TaskEducontentService) => {
      expect(service).toBeTruthy();
    }
  ));
});

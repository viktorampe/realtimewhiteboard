import { inject, TestBed } from '@angular/core/testing';
import { TaskEducontentService } from './task-educontent.service';

describe('TaskEducontentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskEducontentService]
    });
  });

  it('should be created', inject(
    [TaskEducontentService],
    (service: TaskEducontentService) => {
      expect(service).toBeTruthy();
    }
  ));
});

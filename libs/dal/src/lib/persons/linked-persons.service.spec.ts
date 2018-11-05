import { inject, TestBed } from '@angular/core/testing';
import { LinkedPersonService } from './linked-persons.service';

describe('LinkedPersonsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LinkedPersonService]
    });
  });

  it('should be created', inject(
    [LinkedPersonService],
    (service: LinkedPersonService) => {
      expect(service).toBeTruthy();
    }
  ));
});

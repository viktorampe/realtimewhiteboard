import { TestBed, inject } from '@angular/core/testing';

import { LinkedPersonsService } from './linked-persons.service';

describe('LinkedPersonsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LinkedPersonsService]
    });
  });

  it('should be created', inject(
    [LinkedPersonsService],
    (service: LinkedPersonsService) => {
      expect(service).toBeTruthy();
    }
  ));
});

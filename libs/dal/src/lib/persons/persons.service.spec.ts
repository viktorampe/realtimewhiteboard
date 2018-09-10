import { inject, TestBed } from '@angular/core/testing';
import { PersonsService } from './persons.service';

describe('PersonsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonsService]
    });
  });

  it('should be created', inject(
    [PersonsService],
    (service: PersonsService) => {
      console.log(service);
      expect(service).toBeTruthy();
    }
  ));
});

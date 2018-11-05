import { inject, TestBed } from '@angular/core/testing';
import {
  PersonService,
  PersonServiceInterface,
  PERSON_SERVICE_TOKEN
} from './persons.service';

describe('PersonsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: PERSON_SERVICE_TOKEN, useClass: PersonService }]
    });
  });

  it('should be created', inject(
    [PERSON_SERVICE_TOKEN],
    (service: PersonServiceInterface) => {
      expect(service).toBeTruthy();
    }
  ));
});

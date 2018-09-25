import { inject, TestBed } from '@angular/core/testing';
import {
  PersonServiceInterface,
  PersonServiceToken,
  PersonsService
} from './persons.service';

describe('PersonsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: PersonServiceToken, useClass: PersonsService }]
    });
  });

  it('should be created', inject(
    [PersonServiceToken],
    (service: PersonServiceInterface) => {
      console.log(service);
      expect(service).toBeTruthy();
    }
  ));
});

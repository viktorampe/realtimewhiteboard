import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { PersonInterface } from '../+models';
import { PersonServiceInterface } from './person.service.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonService implements PersonServiceInterface {
  constructor(private personApi: PersonApi) {}

  findById(userId: number): Observable<PersonInterface> {
    return this.personApi.findById(userId);
  }
}

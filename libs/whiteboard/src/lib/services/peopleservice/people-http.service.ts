import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterface } from '../../models/User.interface';

export interface PeopleHttpServiceInterface {
  getJson(): Observable<UserInterface>;
}

@Injectable({
  providedIn: 'root'
})
export class PeopleHttpService implements PeopleHttpServiceInterface {
  constructor() {}

  getJson(): Observable<UserInterface> {
    throw new Error('Method not implemented.');
  }
}

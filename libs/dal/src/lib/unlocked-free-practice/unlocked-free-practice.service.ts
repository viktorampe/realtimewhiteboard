import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnlockedFreePracticeServiceInterface } from '.';
import { UnlockedFreePracticeInterface } from '../+models';

@Injectable({
  providedIn: 'root'
})
export class UnlockedFreePracticeService
  implements UnlockedFreePracticeServiceInterface {
  constructor() {}
  getAllForUser(userId): Observable<UnlockedFreePracticeInterface[]> {
    return;
  }
}

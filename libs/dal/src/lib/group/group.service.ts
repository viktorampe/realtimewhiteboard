import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroupInterface } from '../+models';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private personApi: PersonApi) {}

  public getAllForUser(userId: number): Observable<GroupInterface[]> {
    return this.personApi
      .getData(userId, 'groups') //TODO differentiate between owned groups and assigned groups?
      .pipe(map((res: { groups: GroupInterface[] }) => res.groups));
  }
}

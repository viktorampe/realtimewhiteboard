import { Injectable } from '@angular/core';
import { MethodApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MethodInterface } from '../+models';
import { MethodServiceInterface } from './method.service.interface';

@Injectable({
  providedIn: 'root'
})
export class MethodService implements MethodServiceInterface {
  constructor(private methodApi: MethodApi, private personApi: PersonApi) {}

  getAll(): Observable<MethodInterface[]> {
    return this.methodApi.find<MethodInterface>();
  }

  getAllowedMethodIds(userId: number): Observable<number[]> {
    return this.personApi
      .getData(userId, 'allowedMethods')
      .pipe(map((res: { allowedMethods: number[] }) => res.allowedMethods));
  }
}

import { Injectable } from '@angular/core';
import { MethodApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { MethodInterface } from '../+models';
import { MethodServiceInterface } from './method.service.interface';

@Injectable({
  providedIn: 'root'
})
export class MethodService implements MethodServiceInterface {
  constructor(private methodApi: MethodApi) {}

  getAll(): Observable<MethodInterface[]> {
    return this.methodApi.find<MethodInterface>();
  }
}

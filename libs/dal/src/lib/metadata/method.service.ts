import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MethodInterface } from '../+models';
import { MethodServiceInterface } from './method.service.interface';

@Injectable({
  providedIn: 'root'
})
export class MethodService implements MethodServiceInterface {
  getAll(): Observable<MethodInterface[]> {
    return of([]);
  }
}

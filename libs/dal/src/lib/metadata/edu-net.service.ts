import { Injectable } from '@angular/core';
import { EduNetApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { EduNetInterface } from '../+models';
import { EduNetServiceInterface } from './edu-net.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EduNetService implements EduNetServiceInterface {
  constructor(private eduNetApi: EduNetApi) {}

  getAll(): Observable<EduNetInterface[]> {
    return this.eduNetApi.find<EduNetInterface>();
  }
}

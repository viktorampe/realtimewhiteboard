import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BundleInterface } from '../+models/Bundle.interface';
import { BundlesServiceInterface } from './bundles.service.interface';

@Injectable({
  providedIn: 'root'
})
export class BundlesService implements BundlesServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<BundleInterface[]> {
    return this.personApi
      .getData(userId, 'bundles')
      .pipe(map((res: { bundles: BundleInterface[] }) => res.bundles));
  }
}

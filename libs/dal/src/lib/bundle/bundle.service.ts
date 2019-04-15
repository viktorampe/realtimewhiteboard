import { Injectable } from '@angular/core';
import { BundleApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnlockedContentInterface } from '../+models';
import { BundleInterface } from '../+models/Bundle.interface';
import { BundleServiceInterface } from './bundle.service.interface';

@Injectable({
  providedIn: 'root'
})
export class BundleService implements BundleServiceInterface {
  constructor(private personApi: PersonApi, private bundleApi: BundleApi) {}

  getAllForUser(userId: number): Observable<BundleInterface[]> {
    return this.personApi
      .getData(userId, 'bundles')
      .pipe(map((res: { bundles: BundleInterface[] }) => res.bundles));
  }

  linkEduContent(
    bundleId: number,
    eduContentIds: number[]
  ): Observable<UnlockedContentInterface[]> {
    return this.bundleApi.linkEduContent(bundleId, eduContentIds);
  }
  linkUserContent(
    bundleId: number,
    userContentIds: number[]
  ): Observable<UnlockedContentInterface[]> {
    return this.bundleApi.linkUserContent(bundleId, userContentIds);
  }
}

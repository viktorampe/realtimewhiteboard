import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { BundleInterface, UnlockedContentInterface } from '../+models';

export const BUNDLE_SERVICE_TOKEN = new InjectionToken('BundleService');

export interface BundleServiceInterface {
  getAllForUser(userId: number): Observable<BundleInterface[]>;
  linkEduContent(
    bundleId: number,
    eduContentIds: number[]
  ): Observable<UnlockedContentInterface[]>;
}

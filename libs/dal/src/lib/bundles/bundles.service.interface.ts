import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { BundleInterface } from '../+models';

export const BUNDLES_SERVICE_TOKEN = new InjectionToken('BundlesService');

export interface BundlesServiceInterface {
  getAllForUser(userId: number): Observable<BundleInterface[]>;
}

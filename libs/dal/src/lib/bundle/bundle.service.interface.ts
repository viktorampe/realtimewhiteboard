import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { BundleInterface } from '../+models/Bundle.interface';

export const BUNDLE_SERVICE_TOKEN = new InjectionToken('BundleService');

export interface BundleServiceInterface {
  getBundles(): Observable<BundleInterface[]>;
}

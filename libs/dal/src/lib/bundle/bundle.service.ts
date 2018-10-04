import { Injectable } from '@angular/core';
import { BundleApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { BundleInterface } from '../+models/Bundle.interface';
import { BundleServiceInterface } from './bundle.service.interface';

@Injectable({
  providedIn: 'root'
})
export class BundleService implements BundleServiceInterface {
  constructor(private bundleApi: BundleApi) {}

  getBundles(): Observable<BundleInterface[]> {
    return this.bundleApi.find<BundleInterface>({});
  }
}

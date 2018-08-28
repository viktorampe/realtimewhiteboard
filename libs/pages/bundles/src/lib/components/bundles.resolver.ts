import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { BundlesViewModel } from './bundles.viewmodel';

@Injectable()
export class BundlesResolver implements Resolve<boolean> {
  constructor(private bundlesViewModel: BundlesViewModel) {}

  resolve(): Observable<boolean> {
    return this.bundlesViewModel.initialize().pipe(take(1));
  }
}

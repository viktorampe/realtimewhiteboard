import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState
} from '@campus/dal';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class MethodViewModel {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {}
}

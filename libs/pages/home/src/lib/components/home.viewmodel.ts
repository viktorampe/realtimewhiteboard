import { Injectable } from '@angular/core';
import { DalState } from '@campus/dal';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class HomeViewModel {
  constructor(private store: Store<DalState>) {}
}

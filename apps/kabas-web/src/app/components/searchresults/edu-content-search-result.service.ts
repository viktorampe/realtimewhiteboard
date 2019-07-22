import { Injectable } from '@angular/core';
import { DalState } from '@campus/dal';
import { Store } from '@ngrx/store';
import { EduContentSearchResultItemServiceInterface } from './edu-content-search-result.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EduContentSearchResultItemService
  implements EduContentSearchResultItemServiceInterface {
  constructor(private store: Store<DalState>) {}
}

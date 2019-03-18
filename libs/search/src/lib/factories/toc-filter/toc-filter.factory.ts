import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TocFilterFactory implements SearchFilterFactory {
  constructor() {}

  public getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    return;
  }
}

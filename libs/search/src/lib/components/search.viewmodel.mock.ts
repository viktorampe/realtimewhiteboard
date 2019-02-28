import { Injectable } from '@angular/core';
import { ViewModelInterface } from '@campus/testing';
import { Observable } from 'rxjs';
import {
  SearchFilterCriteriaInterface,
  SearchFilterInterface,
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface,
  SortModeInterface
} from '../interfaces';
import { SearchViewModel } from './search.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockSearchViewModel
  implements ViewModelInterface<SearchViewModel> {
  public searchState$: Observable<SearchStateInterface>;
  public searchFilters$: Observable<SearchFilterInterface>;

  public reset(state: SearchStateInterface, mode: SearchModeInterface): void {}
  public changeSort(sortMode: SortModeInterface): void {}
  public getNextPage(): void {}
  public changeFilters(criteria: SearchFilterCriteriaInterface): void {}
  public changeSearchTerm(searchTerm: string): void {}
  public updateResult(result: SearchResultInterface<any>): void {} //TODO: remove <any> when other scaffold branch is merged
}

import { Injectable } from '@angular/core';
import { EduContentTOCInterface, MethodInterface } from '@campus/dal';
import {
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { MethodViewModel } from './method.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockMethodViewModel
  implements ViewModelInterface<MethodViewModel> {
  public searchResults$: Observable<SearchResultInterface>;
  public searchState$: Observable<SearchStateInterface>;
  public currentToc$ = new BehaviorSubject<EduContentTOCInterface[]>([]);
  public currentMethod$ = new BehaviorSubject<MethodInterface>(null);

  public getSearchMode(mode: string, book?: number): SearchModeInterface {
    return;
  }

  public getInitialSearchState(): Observable<SearchStateInterface> {
    return;
  }

  public updateState(state: SearchStateInterface): void {}
}

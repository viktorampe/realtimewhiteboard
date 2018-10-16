import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import {
  BundleActions,
  BundleQueries,
  DalState,
  EduContentActions,
  EduContentQueries,
  LearningAreaActions,
  LearningAreaInterface,
  LearningAreaQueries,
  UnlockedBoekeGroupActions,
  UnlockedBoekeGroupQueries,
  UnlockedBoekeStudentActions,
  UnlockedBoekeStudentQueries,
  UnlockedContentActions,
  UnlockedContentQueries,
  UserContentActions,
  UserContentQueries
} from '@campus/dal';
import { StateResolver, StateResolverInterface } from '@campus/pages/shared';
import { ListFormat } from '@campus/ui';
import { Action, Selector, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BundlesViewModel
  implements Resolve<boolean>, StateResolverInterface {
  listFormat$ = new BehaviorSubject<ListFormat>(ListFormat.GRID);
  learningAreas$: Observable<LearningAreaInterface[]> = new BehaviorSubject<
    LearningAreaInterface[]
  >([
    {
      icon: 'polpo-wiskunde',
      id: 19,
      color: '#2c354f',
      name: 'Wiskunde'
    },
    {
      icon: 'polpo-aardrijkskunde',
      id: 1,
      color: '#485235',
      name: 'Aardrijkskunde'
    },
    {
      icon: 'polpo-frans',
      id: 2,
      color: '#385343',
      name: 'Frans'
    },
    {
      icon: 'polpo-godsdienst',
      id: 13,
      color: '#325235',
      name: 'Godsdienst, Didactische & Pedagogische ondersteuning'
    }
  ]);
  learningAreasCounts$: Observable<any> = new BehaviorSubject<any>({
    1: {
      booksCount: 1,
      bundlesCount: 2
    },
    2: {
      booksCount: 4,
      bundlesCount: 0
    },
    13: {
      booksCount: 0,
      bundlesCount: 0
    },
    19: {
      booksCount: 9,
      bundlesCount: 7
    }
  });

  resolve(): Observable<boolean> {
    return this.viewModelResolver.resolve(
      this.getLoadableActions(),
      this.getResolvedQueries()
    );
  }

  getLoadableActions(): Action[] {
    return [
      new LearningAreaActions.LoadLearningAreas(),
      new BundleActions.LoadBundles(),
      new EduContentActions.LoadEduContents(),
      new UserContentActions.LoadUserContents(),
      new UnlockedContentActions.LoadUnlockedContents(),
      new UnlockedBoekeGroupActions.LoadUnlockedBoekeGroups(),
      new UnlockedBoekeStudentActions.LoadUnlockedBoekeStudents()
    ];
  }

  getResolvedQueries(): Selector<object, boolean>[] {
    return [
      LearningAreaQueries.getLoaded,
      BundleQueries.getLoaded,
      EduContentQueries.getLoaded,
      UserContentQueries.getLoaded,
      UnlockedContentQueries.getLoaded,
      UnlockedBoekeGroupQueries.getLoaded,
      UnlockedBoekeStudentQueries.getLoaded
    ];
  }

  constructor(
    store: Store<DalState>,
    private viewModelResolver: StateResolver
  ) {}

  changeListFormat(listFormat: ListFormat): void {
    this.listFormat$.next(listFormat);
  }
}

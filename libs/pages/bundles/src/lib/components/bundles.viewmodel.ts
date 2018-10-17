import { Injectable } from '@angular/core';
import { ActivatedRoute, Resolve } from '@angular/router';
import {
  BundleInterface,
  EduContentMetadataInterface,
  LearningAreaInterface,
  PersonInterface,
  UnlockedBoekeGroupInterface,
  UnlockedBoekeStudentInterface,
  UnlockedContentInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

// TODO remove again when available from @campus/dal
export interface ContentInterface {
  name: string;
  id?: number;
  productType: string;
  fileExtension: string;
  previewImage?: string;
  description: string;
  methodLogos?: string[];
  fileExt?: string;
  fileLabel?: string;
}
export class DalState {}

@Injectable({
  providedIn: 'root'
})
export class BundlesViewModel implements Resolve<boolean> {
  // source streams
  listFormat$: Observable<ListFormat>;
  user$: Observable<PersonInterface>;
  learningAreas$: Observable<LearningAreaInterface[]>;
  bundles$: Observable<BundleInterface[]>;
  unlockedContents$: Observable<UnlockedContentInterface[]>;
  unlockedBookGroups$: Observable<UnlockedBoekeGroupInterface[]>;
  unlockedBookStudents$: Observable<UnlockedBoekeStudentInterface[]>;
  coupledPersons$: Observable<PersonInterface[]>;

  // presentation streams
  // shared
  // > bundles
  private sharedBundles$: Observable<BundleInterface[]>;
  sharedBundlesByLearningArea$: Observable<{
    [key: number]: BundleInterface[];
  }>;
  bundleContentsCount$: Observable<{
    [key: number]: number;
  }>;
  bundleContents$: Observable<ContentInterface[]>;
  // > books
  private sharedBooks$: Observable<EduContentMetadataInterface[]>;
  sharedBooksByLearningArea$: Observable<{
    [key: number]: EduContentMetadataInterface[];
  }>;
  // > learningAreas
  activeLearningArea$: Observable<LearningAreaInterface>;
  sharedLearningAreas$: Observable<LearningAreaInterface[]>;
  sharedLearningAreasCount$: Observable<{
    [key: number]: {
      bundlesCount: number;
      booksCount: number;
    };
  }>;
  sharedLearningAreaBundles$: Observable<BundleInterface[]>;
  sharedLearningAreaBooks$: Observable<EduContentMetadataInterface[]>;

  constructor(private route: ActivatedRoute, private store: Store<DalState>) {}

  resolve(): Observable<boolean> {
    this.learningAreas$ = new BehaviorSubject(<LearningAreaInterface[]>[
      {
        id: 1,
        name: 'Wiskunde',
        icon: 'wiskunde',
        color: '#ff0000'
      },
      {
        id: 2,
        name: 'Aardrijkskunde',
        icon: 'aardrijkskunde',
        color: '#00ff00'
      }
    ]);
    this.sharedLearningAreas$ = this.learningAreas$;
    this.activeLearningArea$ = this.route.params.pipe(
      map((routeParams): number => routeParams.area),
      filter(areaId => !!areaId),
      switchMap(
        areaId =>
          this.learningAreas$.pipe(
            map(areas => areas.filter(area => area.id === areaId).pop())
          )
        // this.store.pipe(select(LearningAreaQueries.getById, { id: areaId }))
      )
    );
    this.sharedLearningAreasCount$ = of({
      1: { bundlesCount: 1, booksCount: 1 },
      2: { bundlesCount: 1, booksCount: 1 }
    });

    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }

  changeListFormat(listFormat: ListFormat): void {
    // this.store.dispatch(new UiActions.SetListFormatUi({ listFormat }));
  }
}

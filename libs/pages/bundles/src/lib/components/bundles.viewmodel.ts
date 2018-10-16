import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import {
  BundleInterface,
  EduContentMetadataInterface,
  LearningAreaInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BundlesViewModel implements Resolve<boolean> {
  listFormat$ = new BehaviorSubject<ListFormat>(ListFormat.GRID);

  bundleContentsCount$: Observable<{
    [key: number]: number;
  }> = new BehaviorSubject<{ [key: number]: number }>({});

  learningAreas$: Observable<LearningAreaInterface[]> = new BehaviorSubject([]);

  sharedLearningAreaBundles$: Observable<{
    [key: number]: BundleInterface[];
  }> = new BehaviorSubject({});

  sharedLearningAreaBooks$: Observable<{
    [key: number]: EduContentMetadataInterface[];
  }> = new BehaviorSubject({});

  resolve(): Observable<boolean> {
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }

  changeListFormat(listFormat: ListFormat): void {
    this.listFormat$.next(listFormat);
  }
}

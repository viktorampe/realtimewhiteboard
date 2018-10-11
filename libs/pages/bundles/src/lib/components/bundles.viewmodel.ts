import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import {
  BundleInterface,
  EduContentBookInterface,
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

  books$: Observable<EduContentBookInterface[]> = new BehaviorSubject<
    EduContentBookInterface[]
  >([
    {
      title: 'boek1'
    },
    {
      title: 'boek2'
    },
    {
      title: 'boek3'
    },
    {
      title: 'boek4'
    },
    {
      title: 'boek5'
    }
  ]);

  selectedLearningArea$: Observable<
    LearningAreaInterface
  > = new BehaviorSubject<LearningAreaInterface>({
    icon: 'polpo-wiskunde',
    id: 19,
    color: '#2c354f',
    name: 'Wiskunde'
  });

  bundles$: Observable<BundleInterface[]> = new BehaviorSubject<
    BundleInterface[]
  >([
    this.createBundle('bundle', 19),
    this.createBundle('bundle 2: the bundleing', 19),
    this.createBundle('bundle 3: a bundle of sticks', 19),
    this.createBundle('bundle 4: bundle of joy', 19),
    this.createBundle('bundle 5: bundle of rights', 19)
  ]);

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
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }

  getBundleItemCount(bundle: BundleInterface): number {
    //todo should be something like this
    // bundle.eduContents.length + bundle.userContents.length according to Thomas
    return 0;
  }

  changeListFormat(listFormat: ListFormat): void {
    this.listFormat$.next(listFormat);
  }

  //todo remove when we have actual data
  createBundle(name: string, learningAreaId: number): BundleInterface {
    const startDate: Date = new Date();
    const endDate: Date = new Date();
    endDate.setHours(endDate.getHours() + 2);

    return {
      id: Math.round(Math.random() * 10000),
      teacherId: Math.round(Math.random() * 10000),
      learningAreaId: learningAreaId,
      name: name,
      description: 'this description includes' + name,
      start: startDate,
      end: endDate,
      tasks: [
        {
          name: 'task1'
        },
        {
          name: 'task2'
        },
        {
          name: 'task3'
        },
        {
          name: 'task4'
        },
        {
          name: 'task5'
        },
        {
          name: 'task6'
        },
        {
          name: 'task7'
        }
      ]
    };
  }
}

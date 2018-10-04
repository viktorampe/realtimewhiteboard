import { Component, OnInit } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BundlesViewModel } from './bundles.viewmodel';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent implements OnInit {
  lineView: boolean;
  toolbarFixed: boolean;

  //TODO get streams from vm once that is finisched

  listFormat$: Observable<ListFormat> = new BehaviorSubject<ListFormat>(
    ListFormat.GRID
  );

  filterInput$: Observable<string> = new BehaviorSubject<string>('wis');

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
  displayedLearningAreas$: Observable<LearningAreaInterface[]> = combineLatest(
    this.learningAreas$,
    this.filterInput$
  ).pipe(
    map(([learningAreas, filterInput]: [LearningAreaInterface[], string]) => {
      if (!filterInput || filterInput === '') return learningAreas;
      return learningAreas.filter(learningArea =>
        learningArea.name.toLowerCase().includes(filterInput.toLowerCase())
      );
    })
  );
  learningAreaCounts$: Observable<any> = new BehaviorSubject<any>({
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

  constructor(private bundlesViewModel: BundlesViewModel) {}

  ngOnInit() {
    this.lineView = false;
    this.toolbarFixed = true;
  }
}

import { LearningAreaInterface } from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { Dictionary } from '@ngrx/entity';
import { BehaviorSubject, Observable } from 'rxjs';

export class MockActivatedRoute {
  params: Observable<any> = new BehaviorSubject<any>({
    params: { bundle: 1, area: 1 }
  });
}

export class MockViewModel {
  listFormat$: Observable<ListFormat> = new BehaviorSubject<ListFormat>(
    ListFormat.GRID
  );
  learningAreas$: Observable<LearningAreaInterface[]> = new BehaviorSubject<
    LearningAreaInterface[]
  >([{ name: 'name', color: 'color', id: 1 }]);
  sharedLearningAreasCount$: Observable<
    Dictionary<{
      booksCount: number;
      bundlesCount: number;
    }>
  > = new BehaviorSubject<
    Dictionary<{
      booksCount: number;
      bundlesCount: number;
    }>
  >({
    1: {
      booksCount: 2,
      bundlesCount: 3
    }
  });
  sharedLearningAreas$: Observable<
    LearningAreaInterface[]
  > = new BehaviorSubject<LearningAreaInterface[]>([
    { name: 'shared name', color: 'shared color', id: 1 }
  ]);

  changeListFormat() {}
}

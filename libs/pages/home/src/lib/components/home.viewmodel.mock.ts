import { Injectable } from '@angular/core';
import {
  EduContent,
  EduContentFixture,
  FavoriteFixture,
  FavoriteTypesEnum
} from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import { HomeViewModel } from './home.viewmodel';
import { FavoriteMethodWithEduContent } from './home.viewmodel.selectors';

@Injectable({
  providedIn: 'root'
})
export class MockHomeViewModel implements ViewModelInterface<HomeViewModel> {
  public displayName$ = new BehaviorSubject<string>('George');
  public favoritesWithEduContent$ = new BehaviorSubject<
    FavoriteMethodWithEduContent[]
  >([
    {
      favorite: new FavoriteFixture({
        id: 1,
        name: 'Katapult 1',
        type: FavoriteTypesEnum.BOEKE,
        eduContentId: 1
      }),
      bookId: 3,
      eduContent: new EduContentFixture({ id: 1 }, { eduContentBookId: 3 }),
      logoUrl: 'katapult.svg'
    },
    {
      favorite: new FavoriteFixture({
        id: 2,
        name: 'Mol en Beer 1',
        type: FavoriteTypesEnum.BOEKE,
        eduContentId: 2
      }),
      bookId: 4,
      eduContent: new EduContentFixture({ id: 2 }, { eduContentBookId: 4 }),
      logoUrl: 'molenbeer.svg'
    }
  ]);

  openBoeke(eduContent: EduContent): void {}
}

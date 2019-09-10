import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeViewModel } from '../home.viewmodel';
import { MockHomeViewModel } from '../home.viewmodel.mock';
import { FavoriteMethodWithEduContent } from '../home.viewmodel.selectors';

@Component({
  selector: 'campus-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [{ provide: HomeViewModel, useClass: MockHomeViewModel }]
})
export class HomeComponent {
  public displayName$: Observable<string>;
  public favoritesWithEduContent$: Observable<FavoriteMethodWithEduContent[]>;

  constructor(private homeViewModel: HomeViewModel) {
    this.displayName$ = homeViewModel.displayName$;
    this.favoritesWithEduContent$ = homeViewModel.favoritesWithEduContent$;
  }
}

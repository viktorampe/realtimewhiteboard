import { Component, OnInit } from '@angular/core';
import { EduContent } from '@campus/dal';
import { Observable } from 'rxjs';
import { HomeViewModel } from '../home.viewmodel';
import { FavoriteMethodWithEduContent } from '../home.viewmodel.selectors';

@Component({
  selector: 'campus-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
  //providers: [{ provide: HomeViewModel, useClass: MockHomeViewModel }]
})
export class HomeComponent implements OnInit {
  public displayName$: Observable<string>;
  public favoritesWithEduContent$: Observable<FavoriteMethodWithEduContent[]>;

  constructor(private homeViewModel: HomeViewModel) {}

  ngOnInit() {
    this.displayName$ = this.homeViewModel.displayName$;
    this.favoritesWithEduContent$ = this.homeViewModel.favoritesWithEduContent$;
  }

  public clickOpenBoeke(eduContent: EduContent) {
    this.homeViewModel.openBoeke(eduContent);
  }
}

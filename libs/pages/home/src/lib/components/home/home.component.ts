import { Component, OnInit } from '@angular/core';
import { EduContent } from '@campus/dal';
import { NavItem } from '@campus/ui';
import { Observable } from 'rxjs';
import { HomeViewModel } from '../home.viewmodel';
import { FavoriteMethodWithEduContent } from '../home.viewmodel.selectors';

@Component({
  selector: 'campus-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public displayName$: Observable<string>;
  public favoritesWithEduContent$: Observable<FavoriteMethodWithEduContent[]>;
  public dashboardNavItems$: Observable<NavItem[]>;

  constructor(private homeViewModel: HomeViewModel) {}

  ngOnInit() {
    this.displayName$ = this.homeViewModel.displayName$;
    this.favoritesWithEduContent$ = this.homeViewModel.favoritesWithEduContent$;
    this.dashboardNavItems$ = this.homeViewModel.dashboardNavItems$;
  }

  public clickOpenBoeke(eduContent: EduContent) {
    this.homeViewModel.openBoeke(eduContent);
  }
}

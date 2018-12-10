import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DalState, PersonInterface, UserQueries } from '@campus/dal';
import {
  EnvironmentWebsiteInterface,
  ENVIRONMENT_WEBSITE_TOKEN
} from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'campus-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  private routeParams$ = this.route.params.pipe(shareReplay(1));

  statusCode$: Observable<number>;
  currentUser$: Observable<PersonInterface>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<DalState>,
    @Inject(ENVIRONMENT_WEBSITE_TOKEN)
    public website: EnvironmentWebsiteInterface
  ) {}

  ngOnInit() {
    this.statusCode$ = this.getStatusCode();
    this.currentUser$ = this.getUser();
  }

  private getStatusCode(): Observable<number> {
    return this.routeParams$.pipe(
      map(params => {
        return params.code;
      })
    );
  }

  private getUser(): Observable<PersonInterface> {
    return this.store.pipe(select(UserQueries.getCurrentUser));
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DalState, PersonInterface, UserQueries } from '@campus/dal';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'campus-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  private routeParams$ = this.route.params.pipe(shareReplay(1));

  polpoUrl = 'https://www.polpo.be';
  statusCode$: Observable<number>;
  currentUser$: Observable<PersonInterface>;

  constructor(private route: ActivatedRoute, private store: Store<DalState>) {}

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
    return this.store.select(UserQueries.getCurrentUser);
  }
}

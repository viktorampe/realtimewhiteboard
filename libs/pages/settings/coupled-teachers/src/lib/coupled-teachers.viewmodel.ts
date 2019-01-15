import { Injectable } from '@angular/core';
import { DalState, PersonInterface, UserQueries } from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileViewModel {
  // source streams
  public currentUser$: Observable<PersonInterface>;
  public linkedPersons$: Observable<PersonInterface[]>;

  constructor(private store: Store<DalState>) {
    this.setPresentationStreams();
  }

  private setPresentationStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
  }
}

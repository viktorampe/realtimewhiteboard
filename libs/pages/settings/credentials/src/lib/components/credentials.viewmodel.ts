import { Injectable } from '@angular/core';
import { DalState, PersonInterface, UserQueries } from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CredentialsViewModel {
  public currentUser$: Observable<PersonInterface>;

  constructor(private store: Store<DalState>) {
    this.setPresentationStreams();
  }

  private setPresentationStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
  }
}

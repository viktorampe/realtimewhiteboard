import { Injectable } from '@angular/core';
import {
  DalState,
  PersonInterface,
  UserActions,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileViewModel {
  public currentUser$: Observable<PersonInterface>;
  public messages$: Observable<{
    message: string;
    timeStamp: number;
  }>;

  constructor(private store: Store<DalState>) {
    this.setPresentationStreams();
  }

  public updateProfile(
    userId: number,
    changedProps: Partial<PersonInterface>
  ): void {
    this.store.dispatch(new UserActions.UpdateUser({ userId, changedProps }));
  }

  public saveAvatar(file: string): void {}

  private setPresentationStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    this.messages$ = this.store.pipe(select(UserQueries.getUpdateMessage));
  }
}

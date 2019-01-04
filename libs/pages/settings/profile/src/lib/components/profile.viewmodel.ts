import { Injectable } from '@angular/core';
import {
  DalActions,
  DalState,
  PersonInterface,
  UserActions,
  UserQueries
} from '@campus/dal';
import { Actions, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { UNDO_ACTION } from 'ngrx-undo';
import { merge, Observable } from 'rxjs';
import { filter, mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileViewModel {
  public currentUser$: Observable<Partial<PersonInterface>>;
  public messages$: Observable<string>;

  constructor(private store: Store<DalState>, private actions$: Actions) {
    this.setPresentationStreams();
  }

  public updateProfile(
    userId: number,
    changedProps: Partial<PersonInterface>
  ): void {
    this.store.dispatch(new UserActions.UpdateUser({ userId, changedProps }));
  }

  public saveAvatar(file: File): void {}

  private setPresentationStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    this.messages$ = this.getMessageStream();
  }

  // TODO: dit zou beter ergens ergens in een selector of zo staan
  // maar het is nu vrijdagmiddag en ik heb geen goesting meer
  private getMessageStream(): Observable<string> {
    const successMessage$ = this.actions$.pipe(
      ofType(DalActions.DalActionTypes.ActionSuccessful),
      filter(
        (action: DalActions.ActionSuccessful) =>
          action.payload === { successfulAction: 'User updated' }
      ),
      mapTo('Je profiel is aangepast.')
    );

    const failureMessage$ = this.actions$.pipe(
      ofType(UNDO_ACTION),
      filter(
        (undoAction: { payload: Action }) =>
          undoAction.payload.type === UserActions.UserActionTypes.UpdateUser
      ),
      mapTo('Je profiel kon niet aangepast worden.')
    );

    return merge(successMessage$, failureMessage$);
  }
}

import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import {
  DalState,
  LinkedPersonActions,
  LinkedPersonQueries,
  PersonInterface,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { LinkedPersonsActionTypes } from 'libs/dal/src/lib/+state/linked-person/linked-person.actions';
import { Observable } from 'rxjs';
import { map, merge } from 'rxjs/operators';

// TODO: update interface + put somewhere else
export interface ActionResponse {
  action: string;
  message: string;
  type: 'success' | 'error';
}

// TODO: put somewhere else
export interface ApiValidationErrors extends ValidationErrors {
  nonExistingTeacherCode?: string;
  apiError?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileViewModel {
  // source and presentation streams
  public currentUser$: Observable<PersonInterface>;
  public linkedPersons$: Observable<PersonInterface[]>;

  // intermediate streams
  private linkPersonSuccess$: Observable<ActionResponse>;
  private linkPersonError$: Observable<ActionResponse>;

  private unlinkPersonSuccess$: Observable<ActionResponse>;
  private unlinkPersonError$: Observable<ActionResponse>;

  // presentation streams
  public apiErrors$: Observable<ApiValidationErrors>;
  public successMessages$: Observable<ActionResponse>;

  // TODO: inject toaster service for showing success message
  constructor(private store: Store<DalState>) {
    this.setSourceStreams();
    this.setIntermediateStreams();
    this.setPresentationStreams();
    this.setSubscriptions();
  }

  private setSourceStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    this.linkedPersons$ = this.store.pipe(select(LinkedPersonQueries.getAll));
  }

  private setIntermediateStreams(): void {
    // TODO: replace pseudo code with real selectors
    this.linkPersonError$ = this.store.pipe(
      select(
        ResponseQueries.get({
          action: LinkedPersonsActionTypes.AddLinkedPerson,
          type: 'error'
        })
      )
    );

    // TODO: replace pseudo code with real selectors
    this.linkPersonSuccess$ = this.store.pipe(
      select(
        ResponseQueries.get({
          action: LinkedPersonsActionTypes.AddLinkedPerson,
          type: 'success'
        })
      )
    );

    // TODO: replace pseudo code with real selectors
    this.unlinkPersonSuccess$ = this.store.pipe(
      select(
        ResponseQueries.get({
          action: LinkedPersonsActionTypes.DeleteLinkedPerson,
          type: 'success'
        })
      )
    );

    // TODO: replace pseudo code with real selectors
    this.unlinkPersonError$ = this.store.pipe(
      select(
        ResponseQueries.get({
          action: LinkedPersonsActionTypes.DeleteLinkedPerson,
          type: 'error'
        })
      )
    );
  }

  private setPresentationStreams(): void {
    this.apiErrors$ = this.linkPersonError$.pipe(
      map(response => {
        // TODO: switch based on response.message

        switch (response.message) {
          case 'nonExistingTeacherCode':
            return { nonExistingTeacherCode: 'Deze code is niet geldig ...' };

          default:
            break;
        }
        return {
          apiError: response.message
        };
      })
    );

    this.successMessages$ = this.linkPersonSuccess$.pipe(
      merge(this.unlinkPersonSuccess$)
    );
  }

  private setSubscriptions() {
    this.successMessages$.subscribe(message => {
      this.showSuccessToast(message);
    });
  }

  public linkPerson(publicKey: string): void {
    // TODO: update code when linked person state is finished
    this.store.dispatch(
      new LinkedPersonActions.LinkStudentTeacher({ publicKey })
    );
  }

  public unlinkPerson(id: number): void {
    // TODO: update code when linked person state is finished
    this.store.dispatch(new LinkedPersonActions.UnlinkTeacherStudent({ id }));
  }

  private showSuccessToast(message: ActionResponse) {
    // TODO: call the toast service with the message
    window.alert('implement success message');
  }
}

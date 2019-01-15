import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import {
  DalState,
  LinkedPersonActions,
  LinkedPersonQueries,
  PersonInterface,
  UserQueries
} from '@campus/dal';
import { Action, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ActionResponse {
  action: Action;
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ProfileViewModel {
  // source streams
  private currentUser$: Observable<PersonInterface>;
  private linkedPersons$: Observable<PersonInterface[]>;

  // intermediate streams
  private linkPersonSuccess$: Observable<ActionResponse>;
  private linkPersonError$: Observable<ActionResponse>;

  private unlinkPersonSuccess$: Observable<ActionResponse>;
  private unlinkPersonError$: Observable<ActionResponse>;

  // presentation streams
  apiErrors$: Observable<ValidationErrors>;

  // TODO: inject toaster service for showing success message
  constructor(private store: Store<DalState>) {
    this.setSourceStreams();
    this.setIntermediateStreams();
    this.setPresentationStreams();
  }

  private setSourceStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    this.linkedPersons$ = this.store.pipe(select(LinkedPersonQueries.getAll));
  }

  private setIntermediateStreams(): void {
    this.linkPersonError$ = this.store.pipe(
      select(
        ResponseQueries.getForAction(LinkedPersonActions.AddLinkedPerson, {
          type: 'error'
        })
      )
    );

    this.linkPersonSuccess$ = this.store.pipe(
      select(
        ResponseQueries.getForAction(LinkedPersonActions.AddLinkedPerson, {
          type: 'success'
        })
      )
    );

    this.unlinkPersonSuccess$ = this.store.pipe(
      select(
        ResponseQueries.getForAction(LinkedPersonActions.DeleteLinkedPerson, {
          type: 'success'
        })
      )
    );
    this.unlinkPersonError$ = this.store.pipe(
      select(
        ResponseQueries.getForAction(LinkedPersonActions.DeleteLinkedPerson, {
          type: 'error'
        })
      )
    );
  }

  private setPresentationStreams(): void {
    this.apiErrors$ = this.linkPersonError$.pipe(
      map(response => {
        // TODO: switch based on response.message
        return {
          apiError: response.message
        };
      })
    );
  }

  public linkPerson(person: PersonInterface): void {
    this.store.dispatch(new LinkedPersonActions.AddLinkedPerson({ person }));
  }

  public unlinkPerson(id: number): void {
    this.store.dispatch(new LinkedPersonActions.DeleteLinkedPerson({ id }));
  }

  public showSuccessToast() {
    throw new Error('Method not implemented.');
  }
}

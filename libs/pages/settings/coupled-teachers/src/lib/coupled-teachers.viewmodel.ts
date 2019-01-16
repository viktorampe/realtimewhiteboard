import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import {
  DalState,
  LinkedPersonQueries,
  PersonInterface,
  TeacherStudentActions,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, merge } from 'rxjs/operators';
import { MockCoupledTeachersViewModel } from './coupled-teachers.viewmodel.mock';

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
export class CoupledTeachersViewModel {
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
  // TODO: remove mockViewModel when selectors are available
  constructor(
    private store: Store<DalState>,
    private mockViewModel: MockCoupledTeachersViewModel
  ) {
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
    // TODO: the mockViewModel should be replaced by selectors from the ResponseState (see below for a possible implementation)
    this.linkPersonSuccess$ = this.mockViewModel.linkPersonSuccess$;
    this.linkPersonError$ = this.mockViewModel.linkPersonError$;
    this.unlinkPersonSuccess$ = this.mockViewModel.unlinkPersonSuccess$;
    this.unlinkPersonError$ = this.mockViewModel.unlinkPersonError$;

    // TODO: replace pseudo selector code with real selectors
    // this.linkPersonError$ = this.store.pipe(
    //   select(
    //     ResponseQueries.get({
    //       action:
    //         TeacherStudentActions.TeacherStudentActionTypes.LinkTeacherStudent,
    //       type: 'error'
    //     })
    //   )
    // );
    // TODO: replace pseudo selector code with real selectors
    // this.linkPersonSuccess$ = this.store.pipe(
    //   select(
    //     ResponseQueries.get({
    //       action:
    //         TeacherStudentActions.TeacherStudentActionTypes.LinkTeacherStudent,
    //       type: 'success'
    //     })
    //   )
    // );
    // TODO: replace pseudo selector code with real selectors
    // this.unlinkPersonSuccess$ = this.store.pipe(
    //   select(
    //     ResponseQueries.get({
    //       action:
    //         TeacherStudentActions.TeacherStudentActionTypes
    //           .UnlinkTeacherStudent,
    //       type: 'success'
    //     })
    //   )
    // );
    // TODO: replace pseudo selector code with real selectors
    // this.unlinkPersonError$ = this.store.pipe(
    //   select(
    //     ResponseQueries.get({
    //       action:
    //         TeacherStudentActions.TeacherStudentActionTypes
    //           .UnlinkTeacherStudent,
    //       type: 'error'
    //     })
    //   )
    // );
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
    this.store.dispatch(
      new TeacherStudentActions.LinkTeacherStudent({ publicKey })
    );
  }

  public unlinkPerson(teacherId: number): void {
    this.store.dispatch(
      new TeacherStudentActions.UnlinkTeacherStudent({ teacherId })
    );
  }

  private showSuccessToast(message: ActionResponse) {
    // TODO: call the toast service with the message
    window.alert(message.message);
  }
}

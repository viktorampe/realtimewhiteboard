import { Inject, Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  LinkedPersonQueries,
  PersonInterface,
  TeacherStudentActions,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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
  // private linkPersonError$: Observable<ActionResponse>;
  // private unlinkPersonError$: Observable<ActionResponse>;

  // presentation streams
  public apiErrors$: Observable<ApiValidationErrors>;

  // TODO: inject toaster service for showing success message
  // TODO: remove mockViewModel when selectors are available
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    this.setSourceStreams();
    this.setIntermediateStreams();
    this.setPresentationStreams();
  }

  private setSourceStreams(): void {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
    this.linkedPersons$ = this.store.pipe(select(LinkedPersonQueries.getAll));
  }

  private setIntermediateStreams(): void {
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
    // this.apiErrors$ = this.linkPersonError$.pipe(
    //   map(response => {
    //     // TODO: switch based on response.message
    //     switch (response.message) {
    //       case 'nonExistingTeacherCode':
    //         return { nonExistingTeacherCode: 'Deze code is niet geldig ...' };
    //       default:
    //         break;
    //     }
    //     return {
    //       apiError: response.message
    //     };
    //   })
    // );
  }

  public linkPerson(publicKey: string): void {
    this.store.dispatch(
      new TeacherStudentActions.LinkTeacherStudent({
        publicKey,
        userId: this.authService.userId
      })
    );
  }

  public unlinkPerson(teacherId: number): void {
    this.store.dispatch(
      new TeacherStudentActions.UnlinkTeacherStudent({
        teacherId,
        userId: this.authService.userId
      })
    );
  }
}

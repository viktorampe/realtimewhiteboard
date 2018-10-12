import { Component, OnInit } from '@angular/core';
import { EduContentInterface, StudentContentStatusService } from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable, of } from 'rxjs';
import { catchError, flatMap, tap } from 'rxjs/operators';
import { LoginPageViewModel } from './loginpage.viewmodel';

@Component({
  selector: 'campus-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {
  educontents: Observable<EduContentInterface[]>;
  currentUser: Observable<any>;
  constructor(
    private loginPageviewModel: LoginPageViewModel,
    private personApi: PersonApi,
    private studentContentStatusService: StudentContentStatusService
  ) {}

  ngOnInit() {}

  getCurrentUser() {
    this.currentUser = this.personApi.getCurrent();
  }

  // tslint:disable-next-line:member-ordering
  response$: Observable<any>;
  getStudentContentStatus(id: number) {
    this.response$ = this.studentContentStatusService
      .getAllByStudentId(id)
      .pipe(
        catchError(err => {
          console.log(err);
          return of(false);
        })
      );
  }

  // tslint:disable-next-line:member-ordering
  response2$: Observable<boolean>;
  updateStudentContentStatus() {
    const origValue$ = this.studentContentStatusService.getById(1);
    const editedValue$ = origValue$.pipe(
      tap(
        oldValue =>
          (oldValue.contentStatusId = oldValue.contentStatusId === 1 ? 2 : 1) // togglen tussen 1 en 2
      )
    );

    this.response2$ = editedValue$.pipe(
      flatMap(editedValue =>
        this.studentContentStatusService
          .updateStudentContentStatus(editedValue)
          .pipe(
            catchError(err => {
              console.log(err);
              return of(false);
            })
          )
      )
    );
  }
}

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import {
  LearningAreaInterface,
  StudentContentStatusInterface,
  UiActions
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { UiState } from 'libs/dal/src/lib/+state/ui/ui.reducer';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BundlesViewModel implements Resolve<boolean> {
  learningAreas$: Observable<LearningAreaInterface[]> = new BehaviorSubject<
    LearningAreaInterface[]
  >([
    {
      icon: 'polpo-wiskunde',
      id: 19,
      color: '#2c354f',
      name: 'Wiskunde'
    },
    {
      icon: 'polpo-aardrijkskunde',
      id: 1,
      color: '#485235',
      name: 'Aardrijkskunde'
    },
    {
      icon: 'polpo-frans',
      id: 2,
      color: '#385343',
      name: 'Frans'
    },
    {
      icon: 'polpo-godsdienst',
      id: 13,
      color: '#325235',
      name: 'Godsdienst, Didactische & Pedagogische ondersteuning'
    }
  ]);
  learningAreasCounts$: Observable<any> = new BehaviorSubject<any>({
    1: {
      booksCount: 1,
      bundlesCount: 2
    },
    2: {
      booksCount: 4,
      bundlesCount: 0
    },
    13: {
      booksCount: 0,
      bundlesCount: 0
    },
    19: {
      booksCount: 9,
      bundlesCount: 7
    }
  });

  constructor(
    private uiStore: Store<UiState>,
    private studentContentStatusStore: Store<StudentContentStatusState>
  ) {}

  resolve(): Observable<boolean> {
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }

  changeListFormat(listFormat: ListFormat): void {
    this.uiStore.dispatch(new UiActions.SetListFormatUi({ listFormat }));
  }

  saveStudentContentStatus(
    studentContentStatus: StudentContentStatusInterface
  ) {
    const updatedStudentContentStatus: Update<StudentContentStatusInterface> = {
      id: studentContentStatus.id,
      changes: {
        contentStatusId: studentContentStatus.contentStatusId
      }
    };

    this.studentContentStatusStore.dispatch(
      new StudentContentStatusActions.UpdateStudentContentStatus({
        studentContentStatus: updatedStudentContentStatus
      })
    );
  }
}

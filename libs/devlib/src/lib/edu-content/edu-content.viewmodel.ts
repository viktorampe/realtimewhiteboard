import { Injectable } from '@angular/core';
import {
  EduContentActions,
  EduContentQueries,
  EduContentReducer
} from '@campus/dal';
import { select, Store } from '@ngrx/store';

// TODO replace state object with actual DalState import
export class DalState {}

@Injectable()
export class EduContentViewModel {
  educontents$: any;

  constructor(private store: Store<EduContentReducer.State>) {}

  getAllEduContents() {
    this.store.dispatch(new EduContentActions.LoadEduContents({ force: true }));
  }

  getEduContent(id: number) {}

  loadEduContentAgain() {
    this.educontents$ = this.store.pipe(select(EduContentQueries.getAll));
  }

  loadEntitiesAgain() {
    this.educontents$ = this.store.pipe(
      select(EduContentQueries.getAllEntities)
    );
  }
}

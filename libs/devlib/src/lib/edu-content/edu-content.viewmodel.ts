import { Injectable } from '@angular/core';
import { EduContentActions, EduContentQueries } from '@campus/dal';
import { Store } from '@ngrx/store';

// TODO replace state object with actual DalState import
export class DalState {}

@Injectable()
export class EduContentViewModel {
  educontents$: any;

  constructor(private store: Store<DalState>) {}

  getAllEduContents() {
    this.store.dispatch(new EduContentActions.LoadEduContents({ force: true }));
  }

  getEduContent(id: number) {}

  loadEduContentAgain() {
    this.educontents$ = this.store.select(EduContentQueries.getAll);
  }

  loadEntitiesAgain() {
    this.educontents$ = this.store.select(EduContentQueries.getAllEntities);
  }
}

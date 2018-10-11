import { Injectable } from '@angular/core';
import { EduContent, EduContentActions, EduContentQueries } from '@campus/dal';
import { Store } from '@ngrx/store';

@Injectable()
export class EduContentViewModel {
  educontents$: any;

  constructor(private store: Store<EduContent.State>) {}

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

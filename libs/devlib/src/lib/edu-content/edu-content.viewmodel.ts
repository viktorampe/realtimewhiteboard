import { Injectable } from '@angular/core';
import { EduContent, EduContentActions, EduContentQueries } from '@campus/dal';
import { select, Store } from '@ngrx/store';

@Injectable()
export class EduContentViewModel {
  educontents$: any = this.store.pipe(
    select(EduContentQueries.getByIds, { ids: [2, 1, 3] })
  );

  constructor(private store: Store<EduContent.State>) {}

  getAllEduContents() {
    this.store.dispatch(new EduContentActions.LoadEduContents());
  }

  getEduContent(id: number) {}

  loadEduContentAgain() {
    this.educontents$ = this.store.select(EduContentQueries.getAll);
  }

  loadEntitiesAgain() {
    this.educontents$ = this.store.select(EduContentQueries.getAllEntities);
  }
}

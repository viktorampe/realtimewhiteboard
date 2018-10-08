import { Injectable } from '@angular/core';
import { EduContent, EduContentActions, EduContentQueries } from '@campus/dal';
import { Store } from '@ngrx/store';

@Injectable()
export class EduContentViewModel {
  educontents$ = this.store.select(EduContentQueries.selectAllEduContents);
  selectedEduContent$ = this.store
    .pipe
    // select(EduContentQueries.selectedEduContent(1))
    ();
  constructor(private store: Store<EduContent.State>) {}

  getAllEduContents() {
    this.store.dispatch(new EduContentActions.LoadEduContents());
  }

  getEduContent(id: number) {}
}

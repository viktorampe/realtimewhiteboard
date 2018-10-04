import { Injectable } from '@angular/core';
import {
  EduContentsState,
  EDUCONTENT_QUERY,
  LoadEduContents
} from '@campus/dal';
import { Store } from '@ngrx/store';

@Injectable()
export class EduContentViewModel {
  educontents$ = this.store.select(EDUCONTENT_QUERY.selectAllEduContents);
  constructor(private store: Store<EduContentsState>) {}

  getAllEducontents() {
    this.store.dispatch(new LoadEduContents());
  }
}

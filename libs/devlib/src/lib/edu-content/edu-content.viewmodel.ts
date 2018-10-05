import { Injectable } from '@angular/core';
import { Educontent, EducontentActions, EducontentQueries } from '@campus/dal';
import { Store } from '@ngrx/store';

@Injectable()
export class EduContentViewModel {
  educontents$ = this.store.select(EducontentQueries.selectAllEduContents);
  constructor(private store: Store<Educontent.State>) {}

  getAllEducontents() {
    this.store.dispatch(new EducontentActions.LoadEduContents());
  }
}

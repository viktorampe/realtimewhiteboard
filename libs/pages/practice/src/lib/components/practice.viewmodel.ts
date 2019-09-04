import { Injectable } from '@angular/core';
import { DalState, MethodQueries, MethodYearsInterface } from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PracticeViewModel {
  public methodYears$: Observable<MethodYearsInterface[]>;
  constructor(private store: Store<DalState>) {
    this.initialize();
  }

  private setPresentationStreams(): void {
    this.methodYears$ = this.store.pipe(
      select(MethodQueries.getAllowedMethodYears)
    );
  }

  private initialize() {
    this.setPresentationStreams();
  }
}

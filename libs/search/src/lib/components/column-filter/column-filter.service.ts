import { Injectable } from '@angular/core';
import { SearchFilterCriteriaInterface } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ColumnFilterService {
  public preserveColumn: boolean;
  public previousFilterCriteria: SearchFilterCriteriaInterface;
  public actionSource: string;
  public isLastChild: boolean;
  public visibleColumnIndex: number;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.visibleColumnIndex = 0;
    this.isLastChild = false;
    this.actionSource = null;
    this.preserveColumn = false;
    // start with an empty criteria state
    this.previousFilterCriteria = {
      name: '',
      label: '',
      keyProperty: '',
      displayProperty: '',
      values: []
    };
  }
}

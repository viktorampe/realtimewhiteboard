import { Injectable } from '@angular/core';
import { SearchFilterCriteriaInterface } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ColumnFilterService {
  public preserveColumn: boolean;
  public previousFilterCriteriaCount: number;
  public previousFilterCriteria: SearchFilterCriteriaInterface;
  public actionSource: string;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.actionSource = null;
    this.preserveColumn = false;
    this.previousFilterCriteriaCount = 0;
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

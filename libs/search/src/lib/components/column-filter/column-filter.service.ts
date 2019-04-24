import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColumnFilterService {
  public preserveColumn: boolean;
  public forwardAnimation: boolean;
  public previousFilterCriteriaCount: number;

  constructor() {
    this.preserveColumn = false;
    this.forwardAnimation = true;
    this.previousFilterCriteriaCount = undefined;
  }
}

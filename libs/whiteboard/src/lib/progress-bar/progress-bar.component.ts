import { Component, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'campus-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnChanges {
  progressPercentage: number;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    return this.getProgressPercentage();
  }

  getProgressPercentage() {
    return 48; //TODO: calculate corrext percentage
  }
}

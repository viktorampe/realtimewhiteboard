import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'campus-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnChanges {
  @Input() amountOfImages: number;
  @Input() amountCompleted: number;

  progressPercentage: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.amountOfImages || changes.amountCompleted) {
      this.progressPercentage = this.getProgressPercentage();
    }
  }

  getProgressPercentage() {
    return (this.amountCompleted / this.amountOfImages) * 100 + '%';
  }
}

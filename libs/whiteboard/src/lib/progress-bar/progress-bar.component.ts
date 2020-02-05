import {
  Component,
  Input,
  OnInit,
  SimpleChange,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'campus-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() amountOfImages: number;
  @Input() amountCompleted: number;

  progressPercentage: string;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const amountOfImagesChange: SimpleChange = changes.amountOfImages;
    const amountCompletedChange: SimpleChange = changes.amountCompleted;

    if (
      amountOfImagesChange.previousValue !==
        amountOfImagesChange.currentValue ||
      amountCompletedChange.previousValue !== amountCompletedChange.currentValue
    )
      this.progressPercentage = this.getProgressPercentage();
  }

  getProgressPercentage() {
    return (this.amountCompleted / this.amountOfImages) * 100 + '%';
  }
}

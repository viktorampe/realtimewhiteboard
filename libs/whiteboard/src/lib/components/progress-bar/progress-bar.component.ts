import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  @Input() progressPercentage: number;

  constructor() {}
}

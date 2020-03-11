import { Component, HostBinding, Input } from '@angular/core';

export enum ProgressFormEnum {
  LINEAR = 'linear',
  CIRCULAR = 'circular'
}

@Component({
  selector: 'campus-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent {
  @Input() count?: number;
  @Input() total? = 100;
  @Input() completedIcon?: string;
  @Input() showPercentage? = false;
  @Input() form: ProgressFormEnum;

  @HostBinding('class.ui-progress')
  private uiProgressClass = true;

  constructor() {}
}

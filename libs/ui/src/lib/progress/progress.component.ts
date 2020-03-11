import {
  Component,
  ContentChild,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

export enum ProgressFormEnum {
  LINEAR = 'linear',
  CIRCULAR = 'circular'
}

export enum ProgressModeEnum {
  DETERMINATE = 'determinate',
  INDETERMINATE = 'indeterminate'
}

@Directive({
  selector:
    '[campusCompletedProgressIcon], [completedProgressIcon], completed-progress-icon'
})
export class CompletedProgressIconDirective {}

@Component({
  selector: 'campus-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnChanges {
  public forms: typeof ProgressFormEnum = ProgressFormEnum;
  public modes: typeof ProgressModeEnum = ProgressModeEnum;
  public percentage = 0;

  @Input() total? = 100;
  @Input() count: number;

  @Input() showPercentage? = false;
  @Input() form: ProgressFormEnum = ProgressFormEnum.CIRCULAR;
  @Input() mode? = ProgressModeEnum.DETERMINATE;
  @Input() diameter? = 100;

  @HostBinding('class.ui-progress')
  private uiProgressClass = true;

  @ContentChild(CompletedProgressIconDirective, { static: true })
  completedIcon: ElementRef;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    let count = this.count;
    let total = this.total;
    if (changes.count) {
      count = changes.count.currentValue;
    }
    if (changes.total) {
      total = changes.total.currentValue;
    }
    this.percentage = Math.min(Math.ceil((count / total) * 100), 100);
  }
}

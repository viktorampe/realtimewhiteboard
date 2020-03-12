import {
  Component,
  ContentChild,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
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
export class ProgressComponent implements OnChanges, OnInit {
  public forms: typeof ProgressFormEnum = ProgressFormEnum;
  public modes: typeof ProgressModeEnum = ProgressModeEnum;
  public percentage = 0;

  @Input() total? = 100;
  @Input() count?: number;

  @Input() showPercentage? = false;
  @Input() form: ProgressFormEnum = ProgressFormEnum.CIRCULAR;
  @Input() mode? = ProgressModeEnum.INDETERMINATE;
  @Input() diameter? = 100;

  @HostBinding('class.ui-progress')
  private uiProgressClass = true;

  @ContentChild(CompletedProgressIconDirective, { static: true })
  completedIcon: ElementRef;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.count) {
      this.mode =
        this.count === undefined
          ? ProgressModeEnum.INDETERMINATE
          : ProgressModeEnum.DETERMINATE;

      this.percentage = Math.min(
        Math.ceil((this.count / this.total) * 100),
        100
      );
    }
  }
}

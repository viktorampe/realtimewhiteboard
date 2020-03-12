import {
  animate,
  keyframes,
  style,
  transition,
  trigger
} from '@angular/animations';
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
export class CompletedProgressIconDirective {
  @HostBinding('class.ui-progress__completed-icon')
  completedIconClass = true;
}

@Component({
  selector: 'campus-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  animations: [
    trigger('fadeLabel', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms ease', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('250ms  ease', style({ opacity: 0 }))
      ])
    ]),
    trigger('explodeIcon', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate(
          '800ms 200ms cubic-bezier(.01,.67,.31,1)',
          keyframes([
            style({ transform: 'scale(1.5)', opacity: 1, offset: 0.65 }),
            style({ transform: 'scale(0.8)', opacity: 1, offset: 0.8 }),
            style({ transform: 'scale(1.1)', opacity: 1, offset: 0.9 }),
            style({ transform: 'scale(0.95)', opacity: 1, offset: 0.95 }),
            style({ transform: 'scale(1)', opacity: 1, offset: 1 })
          ])
        )
      ])
    ])
  ]
})
export class ProgressComponent implements OnChanges {
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

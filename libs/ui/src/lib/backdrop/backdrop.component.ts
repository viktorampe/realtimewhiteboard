import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { WINDOW } from '@campus/browser';
import { UiOptionsInterface, UI_OPTIONS } from '../ui-options';

/**
 * Backdrop Reveal Action, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusBackDropRevealAction], [backdropRevealAction], backdrop-reveal-action'
})
// tslint:disable-next-line: directive-class-suffix
export class BackdropRevealAction {}
/**
 * Backdrop Collapse Action, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusBackDropCollapseAction], [backdropCollapseAction], backdrop-collapse-action'
})
// tslint:disable-next-line: directive-class-suffix
export class BackdropCollapseAction {}

/**
 * Backdrop Header Actions, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusBackdropHeaderActions], [backdropHeaderActions], backdrop-header-actions'
})
// tslint:disable-next-line: directive-class-suffix
export class BackdropHeaderActions {}

/**
 * Content of a backLayer, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector: '[campusBackLayerContent], [backLayerContent], back-layer-content'
})
// tslint:disable-next-line: directive-class-suffix
export class BackLayerContent {}

/**
 * Content of a Front layer, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusFrontLayerContent], [frontLayerContent], front-layer-content'
})
// tslint:disable-next-line: directive-class-suffix
export class FrontLayerContent {}

/**
 * Header of a Front layer, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector: '[campusFrontLayerHeader], [frontLayerHeader], front-layer-header'
})
// tslint:disable-next-line: directive-class-suffix
export class FrontLayerHeader {}

interface BackDropTranslationInterface {
  value: 'dropped' | 'covered';
  params: {
    translateY: string;
  };
}

@Component({
  selector: 'campus-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss'],
  animations: [
    trigger('translateDrop', [
      state(
        'covered',
        style({ transform: 'translateY(calc({{translateY}}))' }),
        { params: { translateY: '0px' } }
      ),
      state('dropped', style({ transform: 'translateY(0px)' })),

      transition('covered => dropped', [
        animate(
          '500ms cubic-bezier(.43,0,.31,1)',
          keyframes([
            style({ transform: 'translateY(8px)', offset: 0.75 }),
            style({ transform: 'translateY(-5px)', offset: 0.9 }),
            style({ transform: 'translateY(0)', offset: 1 })
          ])
        )
      ]),
      transition(
        'dropped => covered',
        [
          animate(
            '500ms cubic-bezier(.43,0,.31,1)',
            keyframes([
              style({
                transform: 'translateY(calc({{translateY}} - 8px))',
                offset: 0.75
              }),
              style({
                transform: 'translateY(calc({{translateY}} + 5px))',
                offset: 0.9
              }),
              style({
                transform: 'translateY(calc({{translateY}}))',
                offset: 1
              })
            ])
          )
        ],
        { params: { translateY: '0px' } }
      )
    ]),
    trigger('simpleFadeAnimation', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('500ms cubic-bezier(.43,0,.31,1)')
      ])
    ])
  ]
})
export class BackdropComponent implements AfterViewInit {
  frontLayerHeight: number;
  backLayerContentMaxHeight: number;
  dropTranslation: BackDropTranslationInterface;
  delta: number;
  maxDelta: number;
  _titles = [];
  _dropped = false;

  @Input() static = false;

  @Input('title')
  set title(value: string) {
    this._titles.pop();
    this._titles.push(value);
  }

  @Input('dropped')
  set dropped(value: boolean) {
    if (!this.static) {
      this._dropped = value;
      this.dropTranslation = this.getDropTranslation();
    }
  }
  get dropped() {
    return this._dropped;
  }
  @Output() droppedChange = new EventEmitter<boolean>();

  @ViewChild('backLayer', { read: ElementRef, static: false })
  backLayerElement: ElementRef;
  @ViewChild('backHeader', { read: ElementRef, static: false })
  backHeaderElement: ElementRef;
  @ViewChild('frontLayer', { read: ElementRef, static: false })
  frontLayerElement: ElementRef;

  constructor(
    @Inject(WINDOW) private window: Window,
    private cdRef: ChangeDetectorRef,
    @Inject(UI_OPTIONS) private uiOptions: UiOptionsInterface
  ) {}

  ngAfterViewInit() {
    this.delta = this.calculateDelta();
    this.maxDelta = this.calculateMaxDelta();

    if (this.delta > this.maxDelta) {
      this.delta = this.maxDelta - this.getFooterHeight();
      this.frontLayerHeight = this.delta + this.getSafeMargin();
    } else {
      this.frontLayerHeight =
        this.window.innerHeight -
        this.getHeaderBottomOffset() -
        this.getFooterHeight();
    }

    this.backLayerContentMaxHeight = this.maxDelta - this.getFooterHeight();
    this.dropTranslation = this.getDropTranslation(); //Initial state
    this.cdRef.detectChanges();
  }

  public updateDropped(value: boolean) {
    if (!this.static) {
      this.dropped = value;
      this.droppedChange.emit(value);
    }
  }

  private getHeaderBottomOffset(): number {
    const backdropLayerTop = this.backLayerElement.nativeElement.offsetTop;
    const backdropHeaderHeight = this.backHeaderElement.nativeElement
      .offsetHeight;
    return backdropLayerTop + backdropHeaderHeight;
  }
  private getFooterHeight(): number {
    return this.uiOptions.footerHeight || 0;
  }
  private getSafeMargin(): number {
    return (
      (this.uiOptions.backdrop && this.uiOptions.backdrop.safeMargin) || 48
    );
  }
  private calculateDelta(): number {
    const frontLayerTop = this.frontLayerElement.nativeElement.offsetTop;
    return frontLayerTop - this.getHeaderBottomOffset();
  }
  private calculateMaxDelta(): number {
    return (
      this.window.innerHeight -
      this.getSafeMargin() -
      this.getHeaderBottomOffset()
    );
  }
  private getDropTranslation(): BackDropTranslationInterface {
    return {
      value: this._dropped ? 'dropped' : 'covered',
      params: {
        translateY: `-${this.delta}px`
      }
    };
  }
}

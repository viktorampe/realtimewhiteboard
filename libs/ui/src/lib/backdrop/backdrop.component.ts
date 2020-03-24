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
  HostListener,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { WINDOW } from '@campus/browser';
import { EnvironmentUIInterface, ENVIRONMENT_UI_TOKEN } from '../tokens';

/**
 * Backdrop Reveal Action, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusBackDropRevealAction], [backdropRevealAction], [backdrop-reveal-action], backdrop-reveal-action'
})
export class BackdropRevealActionDirective {}
/**
 * Backdrop Collapse Action, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusBackDropCollapseAction], [backdropCollapseAction], [backdrop-collapse-action], backdrop-collapse-action'
})
export class BackdropCollapseActionDirective {}

/**
 * Backdrop Header Actions, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusBackdropHeaderActions], [backdropHeaderActions], [backdrop-header-actions], backdrop-header-actions'
})
export class BackdropHeaderActionsDirective {}

/**
 * Content of a backLayer, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusBackLayerContent], [backLayerContent], [back-layer-content], back-layer-content'
})
export class BackLayerContentDirective {}

/**
 * Content of a Front layer, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusFrontLayerContent], [frontLayerContent], [front-layer-content], front-layer-content'
})
export class FrontLayerContentDirective {}

/**
 * Header of a Front layer, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector:
    '[campusFrontLayerHeader], [frontLayerHeader], [front-layer-header], front-layer-header'
})
export class FrontLayerHeaderDirective {}

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
export class BackdropComponent implements OnChanges, AfterViewInit {
  frontLayerHeight: number;
  backLayerContentMaxHeight: number;
  dropTranslation: BackDropTranslationInterface;
  delta: number;
  maxDelta: number;
  titles: string[] = [];

  @Input() private static = false;
  @Input() private title: string;
  @Input() dropped = false;

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
    @Inject(ENVIRONMENT_UI_TOKEN) private environmentUI: EnvironmentUIInterface
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.title) {
      this.titles.pop();
      this.titles.push(this.title);
    }
    if (changes.dropped) {
      if (!this.static) {
        this.dropTranslation = this.getDropTranslation();
      }
    }
  }

  ngAfterViewInit() {
    this.setupHeights();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setupHeights();
  }
  private setupHeights() {
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

  public getBacklayerTop() {
    return this.backLayerElement.nativeElement.offsetTop;
  }
  public getBacklayerHeight() {
    return this.backHeaderElement.nativeElement.offsetHeight;
  }
  public getFrontlayerTop() {
    return this.frontLayerElement.nativeElement.offsetTop;
  }

  public getDropTranslation(): BackDropTranslationInterface {
    return {
      value: this.dropped ? 'dropped' : 'covered',
      params: {
        translateY: `-${this.delta}px`
      }
    };
  }

  /**
   * Private methods
   */
  private getHeaderBottomOffset(): number {
    const backdropLayerTop = this.getBacklayerTop();
    const backdropHeaderHeight = this.getBacklayerHeight();
    return backdropLayerTop + backdropHeaderHeight;
  }
  private getFooterHeight(): number {
    return this.environmentUI.footerHeight || 0;
  }
  private getSafeMargin(): number {
    return (
      (this.environmentUI.backdrop && this.environmentUI.backdrop.safeMargin) ||
      64
    );
  }
  private calculateDelta(): number {
    const frontLayerTop = this.getFrontlayerTop();
    return frontLayerTop - this.getHeaderBottomOffset();
  }
  private calculateMaxDelta(): number {
    return (
      this.window.innerHeight -
      this.getSafeMargin() -
      this.getHeaderBottomOffset()
    );
  }
}

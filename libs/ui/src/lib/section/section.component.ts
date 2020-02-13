import {
  Component,
  Directive,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

export enum SectionModeEnum {
  STATIC,
  EDITABLE,
  EDITING
}

/**
 * Title of a section, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector: 'section-title'
})
// tslint:disable-next-line: directive-class-suffix
export class SectionTitle {}

/**
 * Content of a section, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector: 'section-content'
})
// tslint:disable-next-line: directive-class-suffix
export class SectionContent {}

/**
 * Actions of a section, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector: 'section-actions'
})
// tslint:disable-next-line: directive-class-suffix
export class SectionActions {}

@Component({
  selector: 'campus-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent {
  @Input() mode: SectionModeEnum;
  @Output() modeChange = new EventEmitter<SectionModeEnum>();
  @Output() actionClick = new EventEmitter<void>();

  modes = SectionModeEnum; // needed for usage in the template

  constructor() {}

  clickSection() {
    if (this.mode === SectionModeEnum.EDITABLE) {
      this.mode = SectionModeEnum.EDITING;
      this.updateMode();
    }
  }

  clickTriggerAction(event: MouseEvent) {
    event.stopPropagation(); // this should not trigger the click section event

    if (this.mode === SectionModeEnum.EDITABLE) {
      this.mode = SectionModeEnum.EDITING;
      this.updateMode();
    } else if (this.mode === SectionModeEnum.STATIC) {
      this.actionClick.emit();
    }
  }

  updateMode() {
    this.modeChange.emit(this.mode);
  }
}

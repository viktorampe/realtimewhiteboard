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
  selector: '[campusSectionTitle], [sectionTitle], section-title'
})
// tslint:disable-next-line: directive-class-suffix
export class SectionTitleDirective {}

/**
 * Content of a section, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector: '[campusSectionContent], [sectionContent], section-content'
})
// tslint:disable-next-line: directive-class-suffix
export class SectionContentDirective {}

/**
 * Actions of a section, needed as it's used as a selector in the API.
 * @docs-private
 */
@Directive({
  selector: '[campusSectionAction], [sectionActions], section-actions'
})
// tslint:disable-next-line: directive-class-suffix
export class SectionActionsDirective {}

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
      this.updateMode(SectionModeEnum.EDITING);
    }
  }

  clickAction(event: MouseEvent) {
    event.stopPropagation(); // this should not trigger the click section event

    if (this.mode === SectionModeEnum.EDITABLE) {
      this.updateMode(SectionModeEnum.EDITING);
    } else if (this.mode === SectionModeEnum.STATIC) {
      this.actionClick.emit();
    }
  }

  private updateMode(mode: SectionModeEnum) {
    this.mode = mode;
    this.modeChange.emit(this.mode);
  }
}

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

  @Output() triggerAction = new EventEmitter<void>();

  modes = SectionModeEnum;

  constructor() {}

  // clickIcon(event: MouseEvent) {
  //   // clicking the icon is always allowed
  //   event.stopPropagation();
  //   this.triggerAction.emit();
  // }

  clickSection(event: MouseEvent) {
    event.stopPropagation();
    // only works in editable mode
    if (this.mode !== SectionModeEnum.EDITABLE) return;
    this.triggerAction.emit();
  }
}

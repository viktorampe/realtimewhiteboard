import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum SectionModeEnum {
  STATIC,
  EDITABLE,
  EDITING
}

@Component({
  selector: 'campus-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent {
  @Input() title: string;
  @Input() mode: SectionModeEnum;
  @Input() icon = 'edit';

  @Output() triggerAction = new EventEmitter<void>();

  modes = SectionModeEnum;

  constructor() {}

  clickIcon(event: MouseEvent) {
    event.stopPropagation();
    this.triggerAction.emit();
  }

  clickSection() {
    if (this.mode !== SectionModeEnum.EDITABLE) return;
    this.triggerAction.emit();
  }
}

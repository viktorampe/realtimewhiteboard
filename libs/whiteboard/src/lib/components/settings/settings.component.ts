import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SettingsInterface } from '../../models/settings.interface';

@Component({
  selector: 'campus-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  @Input() activeColor: string;
  @Input() title: string;
  @Output() update = new EventEmitter<SettingsInterface>();

  constructor() {}

  setDefaultColor(color: string) {
    this.activeColor = color;
  }

  onSubmit() {
    this.update.emit({
      title: this.title,
      defaultColor: this.activeColor
    });
  }
}

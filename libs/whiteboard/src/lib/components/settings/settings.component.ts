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
  @Output() settings = new EventEmitter<SettingsInterface>();

  constructor() {}

  setDefaultColor(color: string) {
    this.activeColor = color;
  }

  onSubmit() {
    this.settings.emit({
      title: this.title,
      defaultColor: this.activeColor
    });
  }
}

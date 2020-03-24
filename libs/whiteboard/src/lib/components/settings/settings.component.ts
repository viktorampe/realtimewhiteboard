import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Output() settings = new EventEmitter<Object>();
  @Input() defaultColor: string;
  @Input() whiteboardTitle: string;

  constructor() {}

  ngOnInit() {}

  setDefaultColor(color: string) {
    this.defaultColor = color;
  }

  emitSettings() {
    this.settings.emit({
      whiteboardTitle: this.whiteboardTitle,
      defaultColor: this.defaultColor
    });
  }
}

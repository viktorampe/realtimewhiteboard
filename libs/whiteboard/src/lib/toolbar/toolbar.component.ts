import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Output() clickColorIcon = new EventEmitter<void>();
  @Output() clickToggleIcon = new EventEmitter<void>();
  @Output() clickToggleView = new EventEmitter<void>();

  @Input() editMode: boolean;

  constructor() {}

  ngOnInit() {}

  showColor() {
    this.clickColorIcon.emit();
  }

  toggleModus() {
    this.clickToggleIcon.emit();
  }

  toggleView() {
    this.clickToggleView.emit();
  }
}

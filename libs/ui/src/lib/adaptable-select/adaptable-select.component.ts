import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-adaptable-select',
  templateUrl: './adaptable-select.component.html',
  styleUrls: ['./adaptable-select.component.scss']
})
export class AdaptableSelectComponent {
  @Input() states: { name: string, id: number };
  @Output() saveStatus = new EventEmitter<number>();
}

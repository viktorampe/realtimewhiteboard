import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-card-text',
  templateUrl: './card-text.component.html',
  styleUrls: ['./card-text.component.scss']
})
export class CardTextComponent implements OnInit {
  @Input() text: string;
  @Input() editMode: boolean;

  @Output() textChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  onChangeText(text: string) {
    this.textChange.emit(text);
  }
}

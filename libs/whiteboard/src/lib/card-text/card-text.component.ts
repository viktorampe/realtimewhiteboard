import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'campus-card-text',
  templateUrl: './card-text.component.html',
  styleUrls: ['./card-text.component.scss']
})
export class CardTextComponent implements OnInit {
  @Input() text: string;
  @Input() editMode: boolean;

  constructor() {}

  ngOnInit() {}
}

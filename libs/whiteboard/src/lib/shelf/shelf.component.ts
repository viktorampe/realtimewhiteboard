import { Component, Input, OnInit } from '@angular/core';
import Card from '../../shared/models/card.interface';

@Component({
  selector: 'campus-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss']
})
export class ShelfComponent implements OnInit {
  @Input() cards: Card[];

  constructor() {}

  ngOnInit() {}
}

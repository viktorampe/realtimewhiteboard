import { Component, Input, OnInit } from '@angular/core';
import Card from '../../interfaces/card.interface';

@Component({
  selector: 'campus-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.css']
})
export class ShelfComponent implements OnInit {
  @Input() cards: Card[];

  constructor() {}

  ngOnInit() {}
}

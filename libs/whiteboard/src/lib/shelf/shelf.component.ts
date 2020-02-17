import { Component, Input, OnInit } from '@angular/core';
import CardInterface from '../../shared/models/card.interface';

@Component({
  selector: 'campus-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss']
})
export class ShelfComponent implements OnInit {
  @Input() cards: CardInterface[];

  constructor() {}

  ngOnInit() {}
}

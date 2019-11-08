import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  cardContent: String = '';

  constructor() {}

  ngOnInit() {}
}

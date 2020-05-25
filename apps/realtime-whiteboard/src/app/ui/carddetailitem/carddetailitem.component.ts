import { Component, Input, OnInit } from '@angular/core';
import { RealtimeCard } from '../../models/realtimecard';

@Component({
  selector: 'campus-carddetailitem',
  templateUrl: './carddetailitem.component.html',
  styleUrls: ['./carddetailitem.component.scss']
})
export class CarddetailitemComponent implements OnInit {
  @Input() card: RealtimeCard;

  constructor() {}

  ngOnInit() {}
}

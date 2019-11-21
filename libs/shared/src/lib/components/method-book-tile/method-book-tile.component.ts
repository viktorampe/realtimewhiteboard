import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'campus-method-book-tile',
  templateUrl: './method-book-tile.component.html',
  styleUrls: ['./method-book-tile.component.scss']
})
export class MethodBookTileComponent implements OnInit {
  @Input() areaName: string;
  @Input() title: string;
  @Input() logoUrl: string;
  @Input() bookId: number;

  constructor() {}

  ngOnInit() {}
}

import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'campus-method-year-tile',
  templateUrl: './method-year-tile.component.html',
  styleUrls: ['./method-year-tile.component.scss']
})
export class MethodYearTileComponent implements OnInit {
  @Input() logoUrl = '';
  @Input() name: string;
  @Input() years: {
    id: number;
    name: string;
    bookId: number;
  }[];

  @HostBinding('class.pages-methods-tile') pagesMethodsTileClass = true;

  constructor() {}

  ngOnInit() {}
}

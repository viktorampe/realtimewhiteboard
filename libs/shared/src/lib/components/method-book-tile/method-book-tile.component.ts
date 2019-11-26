import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'campus-method-book-tile',
  templateUrl: './method-book-tile.component.html',
  styleUrls: ['./method-book-tile.component.scss']
})
export class MethodBookTileComponent implements OnInit {
  @Input() areaName: string;
  @Input() name: string;
  @Input() logoUrl: string;
  @Input() bookId: number;

  @HostBinding('class.shared-method-book-tile')
  pagesMethodsMethodBookTileClass = true;
  constructor() {}

  ngOnInit() {}
}

import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'campus-method-books-tile',
  templateUrl: './method-books-tile.component.html',
  styleUrls: ['./method-books-tile.component.scss']
})
export class MethodBooksTileComponent implements OnInit {
  @Input() logoUrl: string;
  @Input() name: string;
  @Input() years: {
    id: number;
    name: string;
    bookId: number;
  }[] = [];

  @HostBinding('class.shared-method-books-tile')
  pagesMethodsMethodBooksTileClass = true;

  constructor() {}

  ngOnInit() {}
}

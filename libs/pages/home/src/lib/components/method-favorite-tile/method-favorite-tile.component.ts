import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'campus-method-favorite-tile',
  templateUrl: './method-favorite-tile.component.html',
  styleUrls: ['./method-favorite-tile.component.scss']
})
export class MethodFavoriteTileComponent implements OnInit {
  @Input() logoUrl: string;
  @Input() name: string;

  @HostBinding('class.pages-home-method-favorite-tile')
  pagesHomeMethodFavoriteTileClass = true;

  constructor() {}

  ngOnInit() {}
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'campus-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() label: string;
  @Input() icon: string;
  @Input() color: string;
  @Input() secondaryActions: TileSecondaryActionInterface[];

  constructor() {}

  ngOnInit() {}
}

export interface TileSecondaryActionInterface {
  label: string;
  icon: string;
  routerLink?: string[];
  onClick?: (event: Event) => {};
}

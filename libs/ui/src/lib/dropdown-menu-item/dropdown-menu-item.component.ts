import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'campus-dropdown-menu-item',
  templateUrl: './dropdown-menu-item.component.html',
  styleUrls: ['./dropdown-menu-item.component.scss']
})
export class DropdownMenuItemComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() icon: string;
  @Input() image: string;
  @Input() link: string;
  @Input() imageAltText: string;

  constructor() {}

  ngOnInit() {}
}

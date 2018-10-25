import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'campus-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: [
    './dropdown-menu.component.scss',
    './dropdown-menu.component.theme.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class DropdownMenuComponent implements OnInit {
  @Input() showHeader = false;
  @Input() headerIcon: string;
  @Input() itemType: string;
  @Input() newItemCount: string;
  @Input() linkText: string;
  @Input() linkUrl: string;

  @ViewChild(MatMenuTrigger) private trigger: MatMenuTrigger;
  constructor() {}

  ngOnInit() {}

  open() {
    this.trigger.openMenu();
  }
}

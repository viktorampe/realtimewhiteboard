import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'campus-toolbar-item-dropdown',
  templateUrl: './toolbar-item-dropdown.component.html',
  styleUrls: ['./toolbar-item-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarItemDropdownComponent implements OnInit {
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

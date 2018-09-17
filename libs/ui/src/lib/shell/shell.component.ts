import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'campus-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  @Input() logo: string;
  @Input() navItems: Array<any>; //todo change to navItem
  @Input() breadcrumbs: Array<any>; //todo change to breadcrumb
  @Input() alerts: Array<any>; //todo change to alerts
  @Input() messages: Array<any>; //todo change to Message
  @Input() user: any; //todo change to user

  constructor() {}

  ngOnInit() {}
}

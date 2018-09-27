import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-content-action-button',
  templateUrl: './content-action-button.component.html',
  styleUrls: ['./content-action-button.component.scss']
})
export class ContentActionButtonComponent implements OnInit {
  @Input() iconClass: string;
  @Input() action: any; //TODO Action class maken?
  @Input() tooltip: string;

  @Output() click = new EventEmitter(); //TODO welke return?

  constructor() {}

  ngOnInit() {}
}

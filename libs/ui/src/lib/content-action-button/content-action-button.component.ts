import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'campus-content-action-button',
  templateUrl: './content-action-button.component.html',
  styleUrls: ['./content-action-button.component.scss']
})
export class ContentActionButtonComponent implements OnInit {
  @Input() iconClass: string;
  @Input() askConfirm: boolean;
  @Input() action: any; //TODO Action class maken?
  @Input() title: string;

  @Output() click = new EventEmitter(); //TODO welke return?

  constructor() {}

  ngOnInit() {}
}

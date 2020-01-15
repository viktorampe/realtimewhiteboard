import { Component, Input, OnInit } from '@angular/core';

export interface ConfirmationActionInterface {
  icon: string;
  label: string;
  handler: () => any;
}

@Component({
  selector: 'campus-confirmation-pop-up',
  templateUrl: './confirmation-pop-up.component.html',
  styleUrls: ['./confirmation-pop-up.component.scss']
})
export class ConfirmationPopUpComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;

  @Input() actions: ConfirmationActionInterface[];

  constructor() {}

  ngOnInit() {}
}

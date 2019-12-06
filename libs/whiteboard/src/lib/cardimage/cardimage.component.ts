import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'campus-cardimage',
  templateUrl: './cardimage.component.html',
  styleUrls: ['./cardimage.component.scss']
})
export class CardimageComponent implements OnInit {
  @Input() editMode: boolean;

  constructor() {}

  ngOnInit() {}
}

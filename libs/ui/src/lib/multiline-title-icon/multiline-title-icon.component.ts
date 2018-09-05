import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'campus-multiline-title-icon',
  templateUrl: './multiline-title-icon.component.html',
  styleUrls: ['./multiline-title-icon.component.scss']
})
export class MultilineTitleIconComponent implements OnInit {
  @Input() iconclass: string;
  @Input() title: string;
  @Input() subtitle: string;

  constructor() {}

  ngOnInit() {}
}

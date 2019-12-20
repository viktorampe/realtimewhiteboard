import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'campus-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() amountOfImages: number;
  @Input() amountCompleted: number;

  constructor() {}

  ngOnInit() {}
}

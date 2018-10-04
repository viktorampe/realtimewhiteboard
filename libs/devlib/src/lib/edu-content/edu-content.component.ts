import { Component, OnInit } from '@angular/core';
import { EduContentViewModel } from './edu-content.viewmodel';

@Component({
  selector: 'campus-edu-content',
  templateUrl: './edu-content.component.html',
  styleUrls: ['./edu-content.component.scss']
})
export class EduContentComponent implements OnInit {
  constructor(public viewModel: EduContentViewModel) {}

  ngOnInit() {
    this.viewModel.getAllEducontents();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { LearningAreaInterface } from '@campus/dal';

@Component({
  selector: 'campus-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      learningAreas: LearningAreaInterface[];
    }
  ) {}

  ngOnInit() {}
}

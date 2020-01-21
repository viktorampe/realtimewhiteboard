import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { LearningAreaInterface } from '@campus/dal';
import { Source } from '../../interfaces/source.type';

export interface NewTaskFormValues {
  title: string;
  learningArea: LearningAreaInterface;
  type: 'digital' | 'paper';
}

@Component({
  selector: 'campus-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {
  public newTaskForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NewTaskComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      learningAreas: LearningAreaInterface[];
    },
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const { paper, digital } = this.route.snapshot.queryParams;

    let type: Source;
    if (!!paper) {
      type = 'paper';
    } else if (!!digital) {
      type = 'digital';
    }

    this.newTaskForm = this.formBuilder.group(
      {
        title: [null, [Validators.required]],
        learningArea: [null, [Validators.required]],
        type: [type, [Validators.required]]
      },
      {}
    );
  }

  public submit() {
    this.dialogRef.close(this.newTaskForm.value as NewTaskFormValues);
  }

  public cancel() {
    this.dialogRef.close();
  }
}

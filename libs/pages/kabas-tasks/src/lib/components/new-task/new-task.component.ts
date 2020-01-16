import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LearningAreaInterface } from '@campus/dal';

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
    }
  ) {}

  ngOnInit() {
    this.newTaskForm = this.formBuilder.group(
      {
        title: [null, [Validators.required]],
        learningArea: [null, [Validators.required]],
        type: [null, [Validators.required]]
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

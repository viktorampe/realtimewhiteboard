import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'campus-info-panel-input-label',
  templateUrl: './input-label.component.html',
  styleUrls: ['./input-label.component.scss']
})
export class InfoPanelInputLabelComponent implements OnInit {
  @Input() title: string;
  @Input() text: string;
  @Input() showIcon: boolean;
  @Output() saveText = new EventEmitter<string>();

  editing: boolean;
  inputControl: FormControl;


  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.editing = false;
    this.inputControl = new FormControl(this.text, Validators.required);
  }

  edit(): void {
    this.inputControl.setValue(this.text);
    this.editing = !this.editing;
  }

  cancel(): void {
    this.editing = !this.editing;
  }

  save(): void {
    this.saveText.emit(this.inputControl.value);
    this.editing = !this.editing;
  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

/**
 * @example
 *   <campus-confirmable-select 
                           [label]="'status'"
                           [options]="['one', 'two']"
                           [selectedOption]="'one'"
                           [confirmIcon]="'polpo-presentatie'"
                           [text]="'some explenation'"
                           (clickConfirm)="saveStatus($event)"></campus-confirmable-select>
 * 
 * @export
 * @class confirmableSelectComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'campus-confirmable-select',
  templateUrl: './confirmable-select.component.html',
  styleUrls: ['./confirmable-select.component.scss']
})
export class ConfirmableSelectComponent implements OnInit {
  @Input() label: string;
  @Input() text: string;
  @Input() confirmIcon: string;
  @Input() selectedOption: string;
  @Input() options: string[];
  @Output() clickConfirm = new EventEmitter<string>();

  selectControl: FormControl;

  ngOnInit(): void {
    this.selectControl = new FormControl(
      this.selectedOption,
      Validators.required
    );
  }

  onClickConfirm(): void {
    this.selectControl.markAsPristine();
    this.clickConfirm.emit(this.selectControl.value);
  }
}

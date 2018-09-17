import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

/**
 * @example
 *   <campus-adaptable-select 
                           [label]="'status'"
                           [options]="['one', 'two']"
                           [selectedOption]="'one'"
                           [text]="'some explenation'"
                           (saveStatus)="saveStatus($event)"></campus-adaptable-select>
 * 
 * @export
 * @class AdaptableSelectComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'campus-adaptable-select',
  templateUrl: './adaptable-select.component.html',
  styleUrls: ['./adaptable-select.component.scss']
})
export class AdaptableSelectComponent implements OnInit {
  @Input() label: string;
  @Input() text: string;
  @Input() selectedOption: string;
  @Input() options: string[];
  @Output() saveStatus = new EventEmitter<string>();

  selectControl: FormControl;

  ngOnInit(): void {
    this.selectControl = new FormControl(
      this.selectedOption,
      Validators.required
    );
  }

  iconClicked() {
    this.selectControl.markAsPristine();
    this.saveStatus.emit(this.selectControl.value);
  }
}

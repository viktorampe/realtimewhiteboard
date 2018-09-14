import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

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
    this.selectControl = new FormControl(this.selectedOption, Validators.required);
  }

  iconClicked() {
    this.selectControl.markAsPristine();
    this.saveStatus.emit(this.selectControl.value);
  }
}

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'campus-content-editable',
  templateUrl: './content-editable.component.html',
  styleUrls: ['./content-editable.component.scss']
})
export class ContentEditableComponent implements OnInit, OnChanges {
  @Input() text: string;
  @Input() active: boolean;

  //Submit on <enter> is true if multiline is off
  @Input() multiline = false;

  @Output() textChanged: EventEmitter<string> = new EventEmitter();

  @ViewChild('inputField')
  inputField: ElementRef;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.active) {
      this.focusInputField();
    }
  }

  focusInputField() {
    setTimeout(() => {
      this.inputField.nativeElement.focus();
    });
  }

  toggleActive() {
    this.active = !this.active;
    this.focusInputField();
  }
}

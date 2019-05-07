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
  private _active: boolean;

  @Input() text: string;

  get active() {
    return this._active;
  }
  @Input()
  set active(value: boolean) {
    this._active = value;
    if (this._active) {
      this.focusInputField();
    }
  }

  //Submit on <enter> is true if multiline is off
  @Input() multiline = false;
  @Output() textChanged: EventEmitter<string> = new EventEmitter();

  @ViewChild('inputField')
  inputField: ElementRef;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.active && changes.active.currentValue) {
      this.focusInputField();
    }
  }

  focusInputField() {
    setTimeout(() => {
      this.inputField.nativeElement.focus();
    });
  }
}

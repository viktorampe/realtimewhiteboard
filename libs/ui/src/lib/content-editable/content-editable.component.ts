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
  public newText: string;

  @Input() text: string;

  get active() {
    return this._active;
  }
  @Input()
  set active(value: boolean) {
    this._active = value;
    if (this._active) {
      this.startEditing();
    }
  }

  //Optional: input could be added here to add an upper length limit

  //Submit on <enter> is true if multiline is off
  @Input() multiline = false;
  @Output() textChanged: EventEmitter<string> = new EventEmitter();

  @ViewChild('inputField')
  inputField: ElementRef;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.active && changes.active.currentValue) {
      this.startEditing();
    }
  }

  startEditing() {
    this.newText = this.text;

    setTimeout(() => {
      this.inputField.nativeElement.focus();
    });
  }

  saveChanges() {
    //If user left it blank, assume they didn't intend to change anything
    if (this.newText.length > 0) {
      this.text = this.newText;
    }

    this.active = false;

    this.textChanged.emit(this.text);
  }

  cancelChanges() {
    this.active = false;
  }
}

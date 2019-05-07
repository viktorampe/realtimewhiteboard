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

    //Input is not visible yet, so setTimeout
    setTimeout(() => {
      this.inputField.nativeElement.focus();
    });
  }

  saveChanges() {
    //If user left it blank, assume they didn't intend to change anything
    if (this.newText.trim().length > 0 && this.newText != this.text) {
      this.text = this.newText;
      this.textChanged.emit(this.text);
    }

    this.active = false;
  }

  cancelChanges() {
    this.active = false;
  }
}

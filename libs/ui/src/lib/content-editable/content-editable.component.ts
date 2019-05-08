import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { MatInput } from '@angular/material';

@Component({
  selector: 'campus-content-editable',
  templateUrl: './content-editable.component.html',
  styleUrls: ['./content-editable.component.scss']
})
export class ContentEditableComponent {
  private _active = false;
  private oldText: string;

  @Input() text = '';

  get active() {
    return this._active;
  }
  @Input()
  set active(value: boolean) {
    this._active = value;
    if (this._active) {
      this.startEditing();
    } else {
      this.cancelChanges();
    }
  }

  //Optional: input could be added here to add an upper length limit

  @Input() multiline = false;
  @Output() textChanged: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatInput)
  private inputField: MatInput;

  constructor(private cd: ChangeDetectorRef) {}

  startEditing() {
    this.oldText = this.text;

    //We manually detect changes so that the inputField will appear
    //and be ready to receive focus, else it's not ready yet

    this.cd.detectChanges();

    this.inputField.focus();
  }

  saveChanges() {
    if (this.textIsValid() && this.oldText !== this.text) {
      this.textChanged.emit(this.text.trim());
      this._active = false;
    }
  }

  cancelChanges() {
    this.text = this.oldText;
    this.active = false;
  }

  onFocus($event: any) {
    $event.target.select();
  }

  textIsValid() {
    return this.text.trim().length > 0;
  }
}

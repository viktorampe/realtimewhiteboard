import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatInput } from '@angular/material';

@Component({
  selector: 'campus-content-editable',
  templateUrl: './content-editable.component.html',
  styleUrls: ['./content-editable.component.scss']
})
export class ContentEditableComponent implements OnInit {
  private _active = false;
  protected oldText: string;

  @Input() text = '';

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

  @ViewChild(MatInput)
  private inputField: MatInput;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  startEditing() {
    this.oldText = this.text;
    this.cd.detectChanges();

    this.inputField.focus();
  }

  saveChanges() {
    //If user left it blank, assume they didn't intend to change anything
    if (this.textIsValid() && this.oldText !== this.text) {
      this.textChanged.emit(this.text);
      this.active = false;
    } else {
      this.cancelChanges();
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
